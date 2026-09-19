import type { LabNote } from "@/lib/lab-notes";

const media = {
  setup: { kind: "image", src: "/lab-notes/edgefuse/setup.jpg", width: 854, height: 480 },
  hardware: { kind: "image", src: "/lab-notes/edgefuse/hardware.jpg", width: 854, height: 480 },
  adaptive: { kind: "gif", src: "/lab-notes/edgefuse/adaptive-view.gif", width: 600, height: 345 },
  frameSync: { kind: "compare", src: "/lab-notes/edgefuse/frame-sync.gif", width: 730, height: 232 },
  stress: { kind: "compare", src: "/lab-notes/edgefuse/stress-test.gif", width: 730, height: 232 }
} as const;

export const edgefuse: LabNote = {
  slug: "edgefuse",
  updated: "2026-09",
  cover: { src: "/lab-notes/edgefuse/hardware.jpg", width: 854, height: 480 },
  copy: {
    en: {
      title: "EdgeFuse",
      tagline: "Real-time multi-sensor preprocessing with DODA",
      status: "FPGA prototype",
      summary:
        "A visible-light camera and a thermal sensor feed an FPGA where a DODA prototype synchronizes and fuses the two streams before the application CPU ever sees them. Frame synchronization and adaptive view switching, side by side with a CPU-only baseline.",
      stats: [
        { value: "19×", label: "Preprocessing speedup", note: "DODA vs. CPU-only baseline, same input frame" },
        { value: "2", label: "Sensor streams fused", note: "Visible (EO) + thermal (IR)" }
      ],
      todos: [
        { body: "Kalman filter for sensor fusion on the FPGA" },
        { body: "EO/IR geometric correction for lens distortion" },
        { body: "Target: ~100× speedup over the CPU-only baseline" }
      ],
      team: "Jinho Lee · Tingting Xiang · Burin Amornpaisannon",
      sections: [
        {
          id: "motivation",
          title: "Multi-modal sensing on the edge is getting harder",
          body: [
            "Multi-modal sensing is becoming the norm on edge devices such as robots. Even for something as simple as two sensors — a visible-light camera and a thermal sensor — a CPU pipeline is already too slow just for image resizing. The frames arrive faster than the CPU can scale and align them, so the two streams fall out of sync.",
            "Now imagine adding LiDAR, radar, or SAR. The preprocessing burden grows with every sensor added, and the CPU falls further behind. This is a structural problem, not a tuning problem."
          ],
          figures: [
            { media: { ...media.frameSync, half: "left", alt: "CPU-only display showing visible drift between the visible and thermal overlays", left: "CPU-only", right: "With DODA" }, caption: "CPU-only: the visible and thermal streams drift apart — the CPU can't keep up." }
          ]
        },
        {
          id: "approach",
          title: "Move preprocessing next to the sensors with DODA",
          body: [
            "Instead of sending raw frames to the CPU, we deploy a DODA overlay in the FPGA fabric between the sensors and the application core. As pixels arrive from the visible-light camera (45 FPS, 1280×960) and the thermal sensor (9 FPS, 160×120), DODA resizes and time-aligns the two streams on the fly — before the first byte reaches the ARM core.",
            "The preprocessed, fused stream lands on the CPU already synchronized. The application starts the moment the last pixel of each frame arrives — 19× faster preprocessing than the CPU-only baseline."
          ],
          figures: [
            { media: { kind: "pipeline" }, caption: "CPU-only (top): the application waits behind two full preprocessing steps. DODA (bottom): preprocessing overlaps the frame's arrival." }
          ]
        },
        {
          id: "results",
          title: "Frame synchronization",
          body: [
            "Side-by-side on the same hardware. With CPU-only processing (left), the visible and thermal frames drift apart: the thermal overlay lags behind the person's actual position. With DODA preprocessing (right), the streams stay tightly locked."
          ],
          figures: [
            { media: { ...media.frameSync, alt: "Side-by-side: CPU-only output with drifting thermal overlay, DODA output with overlay locked to the person", left: "CPU-only", right: "With DODA" }, caption: "CPU-only shows visible drift between EO and IR. DODA keeps the streams locked." }
          ]
        },
        {
          id: "adaptive",
          title: "Adaptive view switching",
          body: [
            "Beyond synchronization, EdgeFuse adjusts the fusion weight between EO and IR continuously based on ambient brightness — no fixed threshold, just a smooth blend that shifts as the lighting changes. When light is good, the visible view dominates with thermal picture-in-picture; as light falls, the fused thermal view takes over with the visible as PIP.",
            "The switch is immediate: because the decision is made close to the sensors on the FPGA, the application sees the already-switched stream with no extra latency."
          ],
          figures: [
            { media: { ...media.adaptive, alt: "Display switching between the visible view and the fused thermal view as lighting changes" }, caption: "Highlight: visible + thermal PIP. Lowlight: fused thermal + visible PIP. The blend shifts in real time." }
          ]
        },
        {
          id: "setup",
          title: "Hardware",
          body: [
            "Everything runs on one FPGA SoC board with an ARM Cortex-A53. The thermal (IR) sensor and visible-light (EO) camera connect directly to the board; the DODA prototype lives in the FPGA fabric and the application runs on the A53."
          ],
          figures: [
            { media: { ...media.hardware, alt: "FPGA SoC board with thermal sensor on the left and visible-light camera on the right" }, caption: "FPGA + ARM Cortex-A53 board with thermal (IR) sensor and visible-light (EO) camera." },
            { media: { ...media.setup, alt: "Bench: monitor showing fused output, UART log screen, board with sensors" }, caption: "Bench: FPGA display output (top), UART output (left), FPGA + sensors (right)." }
          ]
        },
        {
          id: "future-work",
          title: "What comes next",
          body: [
            "This prototype was built on a tight timeline. The current 19× speedup is only the floor — the architecture has much more headroom. Two near-term priorities:"
          ],
          bullets: [
            "Kalman filter for sensor fusion, implemented as a DODA operator on the FPGA.",
            "EO/IR geometric correction to compensate lens distortion before frames reach the CPU.",
            "Expected outcome with both improvements: ~100× speedup over the CPU-only baseline."
          ]
        }
      ]
    },
    ko: {
      title: "EdgeFuse",
      tagline: "DODA 기반 실시간 멀티센서 전처리",
      status: "FPGA 프로토타입",
      summary:
        "가시광 카메라와 열화상 센서가 FPGA에 연결되고, FPGA 위의 DODA 프로토타입이 두 스트림을 동기화·융합한 뒤에야 애플리케이션 CPU에 전달합니다. 프레임 동기화와 적응형 뷰 전환을 CPU 단독 처리와 나란히 비교합니다.",
      stats: [
        { value: "19×", label: "전처리 속도 향상", note: "동일 입력 프레임, DODA vs. CPU 단독 기준선" },
        { value: "2", label: "융합된 센서 스트림", note: "가시광(EO) + 열화상(IR)" }
      ],
      todos: [
        { body: "FPGA 위 칼만 필터 기반 센서 융합" },
        { body: "렌즈 왜곡 보정을 위한 EO/IR 기하학적 교정" },
        { body: "목표: CPU 단독 기준선 대비 약 100× 가속" }
      ],
      team: "이진호 · Tingting Xiang · Burin Amornpaisannon",
      sections: [
        {
          id: "motivation",
          title: "엣지 디바이스의 멀티모달 센싱, 점점 복잡해진다",
          body: [
            "로봇과 같은 엣지 디바이스에서 멀티모달 센싱은 이미 표준이 되어가고 있습니다. 가시광 카메라와 열화상 센서 두 개만 써도 이미지 리사이즈에 CPU가 버거워집니다. 프레임이 도착하는 속도를 CPU가 따라가지 못하면서 두 스트림은 점점 어긋납니다.",
            "여기에 LiDAR, 레이더, SAR까지 더해지면 어떻게 될까요? 센서가 늘어날수록 전처리 부담은 선형이 아닌 방식으로 커집니다. 이것은 튜닝으로 해결할 수 있는 문제가 아닙니다."
          ],
          figures: [
            { media: { ...media.frameSync, half: "left", alt: "가시광과 열화상 오버레이가 어긋나는 CPU 단독 디스플레이", left: "CPU 단독", right: "DODA 적용" }, caption: "CPU 단독: 가시광과 열화상 스트림이 어긋납니다 — CPU가 따라가지 못합니다." }
          ]
        },
        {
          id: "approach",
          title: "DODA로 전처리를 센서 바로 옆으로",
          body: [
            "원시 프레임을 CPU로 보내는 대신, FPGA 패브릭에 DODA 오버레이를 배치해 센서와 애플리케이션 코어 사이에 둡니다. 가시광 카메라(45 FPS, 1280×960)와 열화상 센서(9 FPS, 160×120)에서 픽셀이 도착하는 즉시 DODA가 리사이즈와 시간 정렬을 처리합니다. ARM 코어에는 이미 동기화된 스트림 하나만 전달됩니다.",
            "마지막 픽셀이 도착하는 순간 전처리가 완료됩니다 — CPU 단독 기준선 대비 전처리 19× 가속."
          ],
          figures: [
            { media: { kind: "pipeline" }, caption: "CPU 단독(위): 두 단계의 전처리가 끝나야 애플리케이션이 시작됩니다. DODA(아래): 전처리가 프레임 도착과 겹쳐 진행됩니다." }
          ]
        },
        {
          id: "results",
          title: "프레임 동기화",
          body: [
            "같은 하드웨어에서 나란히 비교합니다. CPU 단독 처리(왼쪽)에서는 가시광과 열화상 프레임이 어긋나 열화상 오버레이가 사람의 실제 위치에서 벗어납니다. DODA 전처리(오른쪽)에서는 두 스트림이 단단히 고정됩니다."
          ],
          figures: [
            { media: { ...media.frameSync, alt: "나란히 비교: 열화상 오버레이가 어긋나는 CPU 단독 출력과 사람에 고정된 DODA 출력", left: "CPU 단독", right: "DODA 적용" }, caption: "CPU 단독은 EO·IR 사이에 눈에 띄는 드리프트가 생깁니다. DODA는 두 스트림을 락 상태로 유지합니다." }
          ]
        },
        {
          id: "adaptive",
          title: "적응형 뷰 전환",
          body: [
            "동기화에 더해, EdgeFuse는 주변 밝기에 따라 EO와 IR의 융합 가중치를 연속적으로 조정합니다. 고정된 임계값 없이, 조명이 변하는 대로 블렌드가 부드럽게 이동합니다. 빛이 충분하면 가시광 뷰가 주를 이루고 열화상이 PIP로 표시되고, 빛이 줄어들면 융합된 열화상 뷰가 전면에, 가시광이 PIP로 바뀝니다.",
            "전환은 즉각적입니다. FPGA에서 센서 가까이 판단이 이루어지기 때문에 애플리케이션은 이미 전환된 스트림을 추가 지연 없이 받습니다."
          ],
          figures: [
            { media: { ...media.adaptive, alt: "조명 변화에 따라 가시광 뷰와 융합된 열화상 뷰 사이를 전환하는 디스플레이" }, caption: "밝은 환경: 가시광 + 열화상 PIP. 저조도: 융합 열화상 + 가시광 PIP. 블렌드는 실시간으로 이동합니다." }
          ]
        },
        {
          id: "setup",
          title: "하드웨어",
          body: [
            "모든 것이 ARM Cortex-A53이 탑재된 FPGA SoC 보드 한 장에서 동작합니다. 열화상(IR) 센서와 가시광(EO) 카메라는 보드에 직접 연결되며, DODA 프로토타입은 FPGA 패브릭에, 애플리케이션은 A53에서 실행됩니다."
          ],
          figures: [
            { media: { ...media.hardware, alt: "왼쪽에 열화상 센서, 오른쪽에 가시광 카메라가 연결된 FPGA SoC 보드" }, caption: "열화상(IR) 센서와 가시광(EO) 카메라가 연결된 FPGA + ARM Cortex-A53 보드." },
            { media: { ...media.setup, alt: "벤치 구성: 융합 출력을 보여주는 모니터, UART 로그 화면, 책상 위의 보드와 센서" }, caption: "벤치: FPGA 디스플레이 출력(위), UART 출력(왼쪽), FPGA + 센서(오른쪽)." }
          ]
        },
        {
          id: "future-work",
          title: "다음 단계",
          body: [
            "이 프로토타입은 촉박한 일정 속에서 완성되었습니다. 현재의 19× 가속은 시작에 불과합니다. 두 가지 근접 목표:"
          ],
          bullets: [
            "FPGA 위의 DODA 오퍼레이터로 구현하는 칼만 필터 기반 센서 융합.",
            "CPU 도달 전에 렌즈 왜곡을 보정하는 EO/IR 기하학적 교정.",
            "두 개선이 완료될 경우 CPU 단독 기준선 대비 약 100× 가속 예상."
          ]
        }
      ]
    }
  }
};
