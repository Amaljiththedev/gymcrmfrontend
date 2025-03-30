import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, CalendarIcon, UserPlusIcon, RefreshCwIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    // Overall grid layout container
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      
      {/* Total Revenue */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">$12,500</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <TrendingUpIcon className="h-4 w-4" /> +8.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Compared to last month
        </CardFooter>
      </Card>
      
      {/* New Memberships */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>New Memberships</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">45</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <UserPlusIcon className="h-4 w-4" /> +15%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          This week’s sign-ups
        </CardFooter>
      </Card>
      
      {/* Active Members */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>Active Members</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">320</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <TrendingUpIcon className="h-4 w-4" /> +5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Current month engagement
        </CardFooter>
      </Card>
      
      {/* Expiring Memberships */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>Expiring Memberships</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">12</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <TrendingDownIcon className="h-4 w-4" /> -3%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          In the next 7 days
        </CardFooter>
      </Card>
      
      {/* Upcoming Renewals */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>Upcoming Renewals</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">20</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <CalendarIcon className="h-4 w-4" /> Scheduled
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Renewals in the next 15 days
        </CardFooter>
      </Card>
      
      {/* Profit */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>Profit</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">$3,200</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <DollarSignIcon className="h-4 w-4" /> +12%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Net profit this month
        </CardFooter>
      </Card>
      
      {/* New Sign-ups */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>New Sign-ups</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">30</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <UserPlusIcon className="h-4 w-4" /> +10%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Today’s registrations
        </CardFooter>
      </Card>
      
      {/* Membership Renewals */}
      <Card className="relative">
        <CardHeader>
          <CardDescription>Membership Renewals</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">15</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge 
              variant="outline" 
              className="flex items-center gap-1 rounded-lg text-xs"
            >
              <RefreshCwIcon className="h-4 w-4" /> +5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Renewed this week
        </CardFooter>
      </Card>
    </div>
  );
}
