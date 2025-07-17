"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Volume2, VolumeX } from "lucide-react"

interface Pedido {
  id: string
  nombre: string
  timestamp: number
}

export default function PedidosListos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [nombre, setNombre] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Auto-remove orders after 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setPedidos((prev) => prev.filter((pedido) => now - pedido.timestamp < 2 * 60 * 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Play notification sound
  const playNotificationSound = () => {
    if (soundEnabled && typeof window !== "undefined") {
      const audio = new Audio("/notification.mp3")
      audio.play().catch(() => {
        // Fallback to system beep if audio file not available
        console.log("🔔 New order ready!")
      })
    }
  }

  const agregarPedido = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return

    const nuevoPedido: Pedido = {
      id: Date.now().toString(),
      nombre: nombre.trim().toUpperCase(),
      timestamp: Date.now(),
    }

    setPedidos((prev) => [...prev, nuevoPedido])
    setNombre("")
    playNotificationSound()
  }

  const eliminarPedido = (id: string) => {
    setPedidos((prev) => prev.filter((pedido) => pedido.id !== id))
  }

  const getTimeRemaining = (timestamp: number) => {
    const elapsed = Date.now() - timestamp
    const remaining = Math.max(0, 2 * 60 * 1000 - elapsed)
    const seconds = Math.ceil(remaining / 1000)
    return seconds
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://i.imgur.com/nFFG5Tb.jpeg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 mb-4 drop-shadow-lg">¡PEDIDOS LISTOS!</h1>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {soundEnabled ? "Sonido ON" : "Sonido OFF"}
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full max-w-6xl">
          {pedidos.map((pedido) => (
            <Card
              key={pedido.id}
              className="bg-red-600 border-none text-white p-6 text-center animate-in slide-in-from-bottom-4 duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-3xl md:text-4xl font-bold flex-1">{pedido.nombre}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarPedido(pedido.id)}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm opacity-75">Se elimina en {getTimeRemaining(pedido.timestamp)}s</div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {pedidos.length === 0 && <div className="text-white/60 text-xl mb-8">No hay pedidos pendientes</div>}
      </div>

      {/* Add Order Form */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
          <form onSubmit={agregarPedido} className="flex gap-3">
            <Input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cliente"
              required
              className="w-80 bg-white/90 border-white/30 text-black placeholder:text-gray-600"
            />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6">
              Agregar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
