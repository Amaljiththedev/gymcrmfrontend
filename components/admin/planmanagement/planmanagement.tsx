"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Lock, LockKeyholeOpen, Dumbbell, Calendar, TrendingUp, Users } from "lucide-react"
// Dummy gym membership plans with added attributes
const membershipPlans = [
  { id: 1, name: "Basic", duration_days: 30, price: 19.99, is_locked: false, sales: 150, color: "#3f51b5" },
  { id: 2, name: "Pro", duration_days: 90, price: 49.99, is_locked: true, sales: 200, color: "#009688" },
  { id: 3, name: "Elite", duration_days: 180, price: 79.99, is_locked: false, sales: 130, color: "#ff9800" },
  { id: 4, name: "Annual", duration_days: 365, price: 149.99, is_locked: false, sales: 220, color: "#e91e63" },
]

const MembershipPlanManagement = () => {
  // Action handlers
  const handleEdit = (id: number) => console.log(`Edit plan ${id}`)
  const handleLockToggle = (id: number, is_locked: boolean) => console.log(`${is_locked ? "Unlocking" : "Locking"} plan ${id}`)

  // Calculate total sales
  const totalSales = membershipPlans.reduce((sum, plan) => sum + plan.sales, 0)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Membership Plans</h1>
        <div className="flex items-center gap-2 mt-4 md:mt-0 bg-slate-800/50 p-3 rounded-lg">
          <Users size={20} className="text-blue-400" />
          <span className="text-white font-medium">
            Total Members: <span className="font-bold">{totalSales}</span>
          </span>
        </div>
      </div>

      {/* Membership Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {membershipPlans.map((plan, index) => (
          <Card key={`membership-plan-${plan.id}-${index}`} className="relative overflow-hidden backdrop-blur-md bg-slate-900/60 border-slate-800 shadow-xl">
            {/* Color Bar at Top */}
            <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: plan.color }} />

            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Plan Icon & Info */}
                <div className="flex items-center gap-4">
                  <div className="rounded-full w-14 h-14 flex items-center justify-center" style={{ backgroundColor: `${plan.color}30` }}>
                    <Dumbbell size={24} style={{ color: plan.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      {plan.is_locked ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Lock size={12} /> Locked
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-emerald-600 flex items-center gap-1">
                          <LockKeyholeOpen size={12} /> Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-slate-400">
                      <Calendar size={14} className="mr-1" />
                      <span>{plan.duration_days} days</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-2xl md:text-3xl font-bold" style={{ color: plan.color }}>
                  ${plan.price.toFixed(2)}
                </div>
              </div>

              {/* Sales Info */}
              <div className="mt-4 flex items-center gap-2 bg-slate-800/50 p-2 rounded-md">
                <TrendingUp size={16} className="text-slate-400" />
                <span className="text-sm text-slate-300">{plan.sales} active members</span>
                <span className="text-xs text-slate-400 ml-1">({Math.round((plan.sales / totalSales) * 100)}% of total)</span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-800 my-4"></div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => handleEdit(plan.id)} disabled={plan.is_locked} className="text-slate-200">
                  <Edit size={16} className="mr-2" /> Edit Details
                </Button>
                <Button variant={plan.is_locked ? "default" : "secondary"} onClick={() => handleLockToggle(plan.id, plan.is_locked)} style={plan.is_locked ? { backgroundColor: plan.color } : {}}>
                  {plan.is_locked ? <LockKeyholeOpen size={16} className="mr-2" /> : <Lock size={16} className="mr-2" />}
                  {plan.is_locked ? "Activate Plan" : "Deactivate Plan"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MembershipPlanManagement