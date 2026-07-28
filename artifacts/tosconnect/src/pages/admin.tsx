import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Lock, LogOut, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  useAdminLogin,
  useAdminGetStats,
  useAdminListOrders,
  useAdminListBookings,
  useAdminUpdateOrder,
  useAdminUpdateBooking,
  getAdminListOrdersQueryKey,
  getAdminListBookingsQueryKey,
  getAdminGetStatsQueryKey
} from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Order, Booking } from "@workspace/api-client-react"
import { Textarea } from "@/components/ui/textarea"

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
})

export default function AdminPage() {
  const [token, setToken] = React.useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("tosconnect_admin_token") : null
  )

  const adminLogin = useAdminLogin()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  })

  async function onLogin(values: z.infer<typeof loginSchema>) {
    try {
      const res = await adminLogin.mutateAsync({ data: { password: values.password } })
      localStorage.setItem("tosconnect_admin_token", res.token)
      setToken(res.token)
      window.location.reload()
    } catch (error) {
      loginForm.setError("password", { message: "Invalid passphrase" })
    }
  }

  function handleLogout() {
    localStorage.removeItem("tosconnect_admin_token")
    setToken(null)
    window.location.reload()
  }

  if (!token) {
    return (
      <div className="container max-w-md py-24 px-4 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full border-white/10 bg-card/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-serif">Admin Access</CardTitle>
            <CardDescription>Enter your passphrase to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passphrase</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={adminLogin.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={adminLogin.isPending}>
                  {adminLogin.isPending ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-1">Studio Dashboard</h1>
          <p className="text-white/60 text-sm">Manage orders and consultations.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      <DashboardStats />

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
          <TabsTrigger value="orders">Orders (Mixing & Mastering)</TabsTrigger>
          <TabsTrigger value="bookings">Consultations</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>
        <TabsContent value="bookings">
          <BookingsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardStats() {
  const { data: stats, isLoading, error } = useAdminGetStats()

  if (isLoading) return <div className="h-24 flex items-center justify-center text-white/50"><Loader2 className="w-6 h-6 animate-spin" /></div>
  if (error || !stats) return <div className="h-24 text-destructive flex items-center">Failed to load stats.</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
      <Card className="bg-card-border/30 border-white/5">
        <CardContent className="p-4">
          <p className="text-sm text-white/60 mb-1">Total Revenue</p>
          <p className="text-2xl font-mono text-primary font-bold">${stats.paidOrdersTotal + stats.paidBookingsTotal}</p>
        </CardContent>
      </Card>
      <Card className="bg-card-border/30 border-white/5">
        <CardContent className="p-4">
          <p className="text-sm text-white/60 mb-1">Total Orders</p>
          <p className="text-2xl font-mono font-bold text-white">{stats.totalOrders}</p>
        </CardContent>
      </Card>
      <Card className="bg-card-border/30 border-white/5">
        <CardContent className="p-4">
          <p className="text-sm text-white/60 mb-1">Pending Orders</p>
          <p className="text-2xl font-mono font-bold text-white">{stats.pendingOrders}</p>
        </CardContent>
      </Card>
      <Card className="bg-card-border/30 border-white/5">
        <CardContent className="p-4">
          <p className="text-sm text-white/60 mb-1">Total Bookings</p>
          <p className="text-2xl font-mono font-bold text-white">{stats.totalBookings}</p>
        </CardContent>
      </Card>
      <Card className="bg-card-border/30 border-white/5">
        <CardContent className="p-4">
          <p className="text-sm text-white/60 mb-1">Pending Bookings</p>
          <p className="text-2xl font-mono font-bold text-white">{stats.pendingBookings}</p>
        </CardContent>
      </Card>
    </div>
  )
}

function OrdersTable() {
  const { data, isLoading } = useAdminListOrders()
  const [editingId, setEditingId] = React.useState<string | null>(null)

  if (isLoading) return <div className="py-12 text-center text-white/50"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
  if (!data?.orders || data.orders.length === 0) return <div className="py-12 text-center text-white/50">No orders found.</div>

  return (
    <div className="space-y-4">
      {data.orders.map((order) => (
        <Card key={order.id} className="bg-card/50 border-white/10 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 p-4 md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-xs text-white/40">{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
              <h3 className="font-medium text-white">{order.customerName} <span className="text-white/50 font-normal text-sm">({order.email})</span></h3>
              <p className="text-sm text-white/70 mt-1 line-clamp-1">{order.details}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-mono font-bold text-primary">${order.amountUsd}</p>
                <p className="text-xs text-white/50">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditingId(editingId === order.id ? null : order.id)}>
                {editingId === order.id ? "Close" : "Update"}
              </Button>
            </div>
          </div>

          {editingId === order.id && (
            <OrderUpdatePanel order={order} onClose={() => setEditingId(null)} />
          )}
        </Card>
      ))}
    </div>
  )
}

function OrderUpdatePanel({ order, onClose }: { order: Order, onClose: () => void }) {
  const queryClient = useQueryClient()
  const updateOrder = useAdminUpdateOrder()
  
  const [status, setStatus] = React.useState<any>(order.status)
  const [notes, setNotes] = React.useState(order.notes || "")

  const handleSave = async () => {
    try {
      await updateOrder.mutateAsync({
        id: order.id,
        data: { status, notes }
      })
      queryClient.invalidateQueries({ queryKey: getAdminListOrdersQueryKey() })
      queryClient.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() })
      onClose()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="p-4 bg-card-border/30 border-t border-white/5 grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm font-medium mb-2 text-white/80">Stems URLs</p>
        <ul className="text-xs space-y-1 mb-4">
          {order.stemsUrls?.map((url, i) => (
            <li key={i}><a href={`/api/storage${url}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono">Stem {i + 1}</a></li>
          ))}
          {(!order.stemsUrls || order.stemsUrls.length === 0) && <li className="text-white/40">No stems provided.</li>}
        </ul>

        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">Update Status</p>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 bg-background border border-white/10 rounded-md px-3 text-sm text-white"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/80">Producer Notes (Visible to Customer)</p>
        <Textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Add notes for the customer..."
          className="h-24 bg-background"
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={updateOrder.isPending}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={updateOrder.isPending}>
            {updateOrder.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function BookingsTable() {
  const { data, isLoading } = useAdminListBookings()
  const [editingId, setEditingId] = React.useState<string | null>(null)

  if (isLoading) return <div className="py-12 text-center text-white/50"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
  if (!data?.bookings || data.bookings.length === 0) return <div className="py-12 text-center text-white/50">No bookings found.</div>

  return (
    <div className="space-y-4">
      {data.bookings.map((booking) => (
        <Card key={booking.id} className="bg-card/50 border-white/10 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 p-4 md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-xs text-white/40">{booking.id}</span>
                <StatusBadge status={booking.status} />
              </div>
              <h3 className="font-medium text-white">{booking.customerName} <span className="text-white/50 font-normal text-sm">({booking.email})</span></h3>
              <p className="text-sm text-white/70 mt-1 line-clamp-1">{booking.sessionTopic}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-mono font-bold text-blue-400">${booking.amountUsd}</p>
                <p className="text-xs text-white/50">{new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditingId(editingId === booking.id ? null : booking.id)}>
                {editingId === booking.id ? "Close" : "Update"}
              </Button>
            </div>
          </div>

          {editingId === booking.id && (
            <BookingUpdatePanel booking={booking} onClose={() => setEditingId(null)} />
          )}
        </Card>
      ))}
    </div>
  )
}

function BookingUpdatePanel({ booking, onClose }: { booking: Booking, onClose: () => void }) {
  const queryClient = useQueryClient()
  const updateBooking = useAdminUpdateBooking()
  
  const [status, setStatus] = React.useState<any>(booking.status)
  const [zoomLink, setZoomLink] = React.useState(booking.zoomLink || "")
  const [notes, setNotes] = React.useState(booking.notes || "")

  const handleSave = async () => {
    try {
      await updateBooking.mutateAsync({
        id: booking.id,
        data: { status, zoomLink, notes }
      })
      queryClient.invalidateQueries({ queryKey: getAdminListBookingsQueryKey() })
      queryClient.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() })
      onClose()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="p-4 bg-card-border/30 border-t border-white/5 grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1 text-white/80">Preferred Times</p>
          <div className="flex flex-wrap gap-1">
            {booking.preferredTimes?.map(t => <Badge key={t} variant="outline" className="text-[10px] py-0">{t}</Badge>)}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">Update Status</p>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 bg-background border border-white/10 rounded-md px-3 text-sm text-white"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">Zoom / Meet Link</p>
          <Input 
            value={zoomLink} 
            onChange={(e) => setZoomLink(e.target.value)} 
            placeholder="https://zoom.us/j/..."
            className="bg-background"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/80">Producer Notes</p>
        <Textarea 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Add notes for the customer..."
          className="h-24 bg-background"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose} disabled={updateBooking.isPending}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={updateBooking.isPending}>
            {updateBooking.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch(status) {
    case 'pending': return <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">Pending</Badge>
    case 'paid': return <Badge variant="outline" className="border-blue-500/50 text-blue-500">Paid</Badge>
    case 'in_progress': return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>
    case 'confirmed': return <Badge className="bg-blue-500 text-white">Confirmed</Badge>
    case 'delivered': 
    case 'completed': return <Badge className="bg-green-500 text-white">Delivered</Badge>
    case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>
    default: return <Badge variant="outline">{status}</Badge>
  }
}
