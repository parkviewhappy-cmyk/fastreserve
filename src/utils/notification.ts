/**
 * 알림(Notification) 발송 Utility.
 *
 * PM 지시(Sprint 13 PM Review 승인, Sprint 15 구현): Android(Capacitor WebView) 환경에서는
 * 순수 Web Notification API가 시스템 알림으로 안정적으로 뜨지 않을 수 있어,
 * `@capacitor/local-notifications`를 도입해 Android에서는 이 Plugin으로, 그 외
 * 환경(웹 브라우저)에서는 기존 Web Notification API로 알림을 보내도록 분기한다.
 * 두 경로가 동시에 실행되어 알림이 중복 발송되지 않도록 반드시 하나만 선택한다.
 *
 * 새로운 Domain/Manager를 추가하지 않는다. 이 파일은 순수 함수(+ 외부 Plugin 호출) 모음이며,
 * `src/utils/time.ts`, `src/utils/date.ts`와 동일하게 Domain이 아닌 공통 Utility로 분류한다.
 * 알림은 여전히 "정보 제공"目的일 뿐 자동 예약/자동 클릭과는 무관하다(Ready Screen이
 * 임계값을 감지한 "이후"에만 호출되며, 이 파일 자체는 언제 알림을 보낼지 판단하지 않는다).
 */

import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

/** 이 세션에서 사용할 Local Notification id 발급용 카운터(32-bit 정수 범위 내). */
let nextNotificationId = 1

/**
 * 알림 권한을 요청한다(이미 허용/거부된 경우 아무 동작도 하지 않는다).
 * 네이티브(Android/iOS)에서는 `LocalNotifications.checkPermissions()` →
 * 필요 시 `requestPermissions()`를 호출한다. 그 외(웹 브라우저)에서는 기존과 동일하게
 * `Notification.requestPermission()`을 호출한다.
 *
 * TODO(Sprint 10 PM Review, 미해결): 화면 진입 시 자동으로 권한을 요청하는 대신,
 * "예약 알림을 사용하시겠습니까?" 안내 화면을 먼저 보여주고 사용자가 직접 "허용"을
 * 선택했을 때만 권한을 요청하는 방식으로 변경할 예정이다. 이번 Sprint(15)에서도 자동
 * 요청 로직 자체는 유지한다(동작 변경 없음, Notification 발송 "수단"만 교체).
 */
export async function requestNotificationPermission(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await LocalNotifications.checkPermissions()
      if (status.display === 'prompt' || status.display === 'prompt-with-rationale') {
        await LocalNotifications.requestPermissions()
      }
    } catch {
      // 권한 요청 실패는 화면 동작에 영향을 주지 않는다(정보성 기능이므로 무시).
    }
    return
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission()
      } catch {
        // 권한 요청 실패/거부는 무시한다(정보성 기능이므로 화면 동작에 영향 없음).
      }
    }
  }
}

/**
 * 알림을 보낸다. 자동 예약/자동 클릭과 무관한, 사용자에게 상태를 알리는 정보성 알림이다.
 * 네이티브(Android/iOS)에서는 `LocalNotifications.schedule()`을 "지금 즉시"(`at: new Date()`)
 * 시점으로 호출해 시스템 알림으로 표시한다. 그 외(웹 브라우저)에서는 기존 Web Notification
 * API(`new Notification()`)를 사용한다. 두 경로는 서로 배타적이며 동시에 실행되지 않는다.
 */
export async function sendNotice(title: string, body: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      const permission = await LocalNotifications.checkPermissions()
      if (permission.display !== 'granted') return
      await LocalNotifications.schedule({
        notifications: [
          {
            id: nextNotificationId++,
            title,
            body,
            schedule: { at: new Date() },
          },
        ],
      })
    } catch {
      // 알림 생성 실패는 화면 동작에 영향을 주지 않는다(무시).
    }
    return
  }

  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body })
    } catch {
      // 알림 생성 실패는 화면 동작에 영향을 주지 않는다(무시).
    }
  }
}
