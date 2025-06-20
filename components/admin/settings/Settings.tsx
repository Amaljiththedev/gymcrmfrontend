"use client";
import React, { useEffect, useState } from "react";
import { ChevronRight, Home, Mail, Edit } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import {
  fetchManagerProfile,
  updateManagerProfile,
  changeManagerPassword,
} from "@/src/features/manager/managerSlice";

export default function ProfileSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.manager);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    dispatch(fetchManagerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setEmail(profile.email);
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPreviewUrl(profile.profile_picture ? `${API_URL}${profile.profile_picture}` : null);
    }
  }, [profile]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    if (profileImage) formData.append("profile_picture", profileImage);
    dispatch(updateManagerProfile(formData));

    // Password change only if all fields are filled and matched
    if (currentPassword && password && password === confirmPassword) {
      dispatch(changeManagerPassword({ old_password: currentPassword, new_password: password }));
    }
  };

  return (
    <div className="flex flex-1 w-full bg-transparent text-white">
      <div className="flex flex-col w-full max-w-3xl mx-auto px-2 md:px-6 py-3 md:py-6 space-y-4">
        <Card className="backdrop-blur-md text-white border-zinc-700 bg-zinc-900/40">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-medium text-white">Profile Settings</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Update your profile information and manage your account
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 my-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <AspectRatio ratio={1} className="h-40 w-40 rounded-full overflow-hidden border-2 border-red-500/30">
                  <img
                    src={previewUrl || ""}
                    alt="profile"
                    className="object-cover"
                  />
                </AspectRatio>
                <Button
                  variant="outline"
                  className="relative bg-red-900/40 border-red-700/50 hover:bg-red-800/60 w-full text-red-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col space-y-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-zinc-300">First Name</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="text-white bg-zinc-800/90 border-zinc-700"
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-zinc-300">Last Name</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="text-white bg-zinc-800/90 border-zinc-700"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <div className="flex">
                    <div className="bg-zinc-800/90 px-3 flex items-center rounded-l-md border border-r-0 border-zinc-700">
                      <Mail className="h-4 w-4 text-red-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      readOnly
                      value={email}
                      className="rounded-l-none text-white bg-zinc-800/90 border-zinc-700"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-zinc-300">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="text-white bg-zinc-800/90 border-zinc-700"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-white bg-zinc-800/90 border-zinc-700"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-zinc-300">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-white bg-zinc-800/90 border-zinc-700"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 pt-4 border-t border-zinc-700 px-6 py-4">
            <Button variant="outline" className="text-white bg-transparent border-zinc-600 hover:bg-zinc-700/60">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-red-600 hover:bg-red-500 text-white">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
