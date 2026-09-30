import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { RefreshCw, Search, Trash2 } from 'lucide-react'
import { api, fmtSec, type SessionInfo } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function timeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return `${diff} с назад`
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`
  return `${Math.floor(diff / 86400)} дн назад`
}

export function SessionsPage() {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await api.sessions()
      setSessions(data)
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось загрузить сессии')
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 10_000)
    return () => clearInterval(interval)
  }, [load])

  async function deleteSession(key: string) {
    try {
      await api.deleteSession(key)
      toast.success('Сессия удалена')
      load()
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось удалить сессию')
    }
  }

  async function clearAll() {
    if (!confirm('Удалить все сессии?')) return
    try {
      await api.clearSessions()
      toast.success('Все сессии удалены')
      load()
    } catch (err: any) {
      toast.error(err?.message || 'Не удалось очистить сессии')
    }
  }

  const filtered = sessions.filter(
    (s) =>
      s.sessionKey.toLowerCase().includes(search.toLowerCase()) ||
      s.chatId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Сессии</CardTitle>
              <CardDescription>{sessions.length} активных сессий</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={load}>
                <RefreshCw /> Обновить
              </Button>
              <Button size="sm" variant="destructive" onClick={clearAll}>
                <Trash2 /> Очистить все
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по session key или chat ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Key</TableHead>
                <TableHead>Chat ID</TableHead>
                <TableHead>ID аккаунта</TableHead>
                <TableHead>История</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead>Обновлено</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    {sessions.length === 0 ? 'Активных сессий нет' : 'Ничего не найдено'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.sessionKey}>
                    <TableCell className="font-mono text-xs">
                      {s.sessionKey.slice(0, 16)}…
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {s.chatId.slice(0, 12)}…
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {s.accountId.slice(0, 12)}…
                    </TableCell>
                    <TableCell>
                      {s.historyComplete ? (
                        <Badge variant="outline" className="text-emerald-400">полная</Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-400">инициализация</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          s.ttlRemaining > 3600
                            ? 'text-emerald-400'
                            : s.ttlRemaining > 600
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }
                      >
                        {fmtSec(s.ttlRemaining)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {timeAgo(s.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="destructive" onClick={() => deleteSession(s.sessionKey)}>
                        <Trash2 />
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
