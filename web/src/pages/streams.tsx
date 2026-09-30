import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Square, Waves } from 'lucide-react'
import { api, fmtSec, type ActiveStream } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function StreamsPage() {
  const [streams, setStreams] = useState<ActiveStream[]>([])
  const [stopping, setStopping] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const d = await api.streams()
      setStreams(d.streams || [])
    } catch (err: any) {
      // keep last known state on transient failures
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 2000)
    return () => clearInterval(t)
  }, [load])

  async function stop(key: string) {
    if (!confirm('Завершить этот поток?') ) return
    setStopping(key)
    try {
      const res = await api.stopStream(key)
      toast.success(res.ok ? 'Поток завершён' : 'Поток не найден')
      load()
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось завершить')
    } finally {
      setStopping(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Waves className="size-4" />
            Активные потоки
          </CardTitle>
          <CardDescription>{streams.length} генераций выполняется сейчас</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Аккаунт</TableHead>
                <TableHead>Сессия</TableHead>
                <TableHead>Возраст</TableHead>
                <TableHead className="text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    Нет выполняющихся потоков
                  </TableCell>
                </TableRow>
              ) : (
                streams.map((s) => (
                  <TableRow key={s.key}>
                    <TableCell className="font-mono text-xs">{s.accountId.slice(0, 12)}…</TableCell>
                    <TableCell className="font-mono text-xs">{s.uiSessionId.slice(0, 16)}…</TableCell>
                    <TableCell>
                      <Badge variant={s.ageMs > 120000 ? 'outline' : 'secondary'} className={s.ageMs > 120000 ? 'text-amber-400' : ''}>
                        {fmtSec(Math.floor(s.ageMs / 1000))}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="destructive" disabled={stopping === s.key} onClick={() => stop(s.key)}>
                        <Square className="size-3.5" />
                        Остановить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
