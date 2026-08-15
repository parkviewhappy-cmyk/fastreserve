import type { Reservation } from '@/types/reservation'
import type { ReservationRepository } from './reservation.repository'

const STORAGE_KEY = 'fastreserve:reservations'

/**
 * LocalStorage 기반 Repository 구현체.
 * Sprint 3 범위: 브라우저 LocalStorage에 예약 목록(Array)을 저장/조회한다.
 * ReservationRepository 인터페이스는 변경하지 않고 구현체만 추가했다.
 * MockReservationRepository는 그대로 유지한다.
 */
export class LocalStorageReservationRepository implements ReservationRepository {
  getAll(): Reservation[] {
    return this.readAll()
  }

  getById(id: string): Reservation | undefined {
    return this.readAll().find((reservation) => reservation.id === id)
  }

  save(reservation: Reservation): Reservation {
    const all = this.readAll()
    all.push(reservation)
    this.writeAll(all)
    return reservation
  }

  update(id: string, patch: Partial<Reservation>): Reservation | undefined {
    const all = this.readAll()
    const index = all.findIndex((reservation) => reservation.id === id)
    if (index === -1) return undefined
    all[index] = { ...all[index], ...patch }
    this.writeAll(all)
    return all[index]
  }

  delete(id: string): boolean {
    const all = this.readAll()
    const index = all.findIndex((reservation) => reservation.id === id)
    if (index === -1) return false
    all.splice(index, 1)
    this.writeAll(all)
    return true
  }

  private readAll(): Reservation[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as Reservation[]) : []
    } catch {
      return []
    }
  }

  private writeAll(reservations: Reservation[]): void {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
  }
}
