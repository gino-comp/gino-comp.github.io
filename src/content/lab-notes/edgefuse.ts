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
        "A visible-light camera and a thermal sensor feed an FPGA where a DODA prototype synchronizes and fuses the two streams before the application CPU ever sees them. Adaptive view switching, frame synchronization and a stress test, side by side with a CPU-only baseline.",
      stats: [
        { value: "17×", label: "Preprocessing speedup", note: "DODA vs. CPU baseline, same input frame" },
        { value: "2", label: "Sensor streams fused", note: "Visible (EO) + thermal (IR)" },
        { value: "45 → 9 FPS", label: "Visible stream synchronized", note: "Locked to the thermal sensor's rate" },
        { value: "1280×960 → 160×120", label: "Visible stream reduced", note: "Before it reaches the CPU" }
      ],
      team: "Jinho Lee · Tingting Xiang · Burin Amornpaisannon",
      sections: [
        {
          id: "overview",
          title: "What EdgeFuse shows",
          body: [
            "Multi-sensor perception stalls at the same place every time: raw frames from each sensor are copied into memory, aligned and resized by the CPU, and only then handed to the application. EdgeFuse moves that work next to the sensors. A DODA prototype on the FPGA takes the visible and thermal streams as pixels arrive, synchronizes them, scales the visible stream down to the thermal sensor's rate and resolution, and delivers one fused, reduced stream to the ARM core running the application.",
            "The demo runs three scenes on the same hardware: a synchronized visible + thermal stream with adaptive view switching, a frame-synchronization comparison against a CPU-only pipeline, and a stress test that pushes application latency toward the frame interval."
          ]
        },
        {
          id: "setup",
          title: "Hardware and setup",
          body: [
            "Everything runs on one FPGA SoC board with an ARM Cortex-A53. The thermal (IR) sensor and the visible-light (EO) camera connect directly to the board; the DODA prototype lives in the FPGA fabric and the application runs on the A53. The board drives a display for the fused output and logs over UART."
          ],
          figures: [
            { media: { ...media.hardware, alt: "FPGA SoC board with the thermal sensor on the left and the visible-light camera on the right" }, caption: "FPGA + ARM Cortex-A53 board with the thermal (IR) sensor and the visible-light (EO) camera." },
            { media: { ...media.setup, alt: "Bench setup: monitor showing the fused output, a second screen with the UART log, and the board with sensors on the desk" }, caption: "Bench: FPGA display output (top), UART output (left), FPGA + sensors (right)." }
          ]
        },
        {
          id: "adaptive",
          title: "Synchronized stream and adaptive view switching",
          body: [
            "The visible stream (45 FPS, 1280×960) is synchronized down to the thermal sensor's 9 FPS at 160×120 before fusion, so the two views always show the same instant. In good light the display shows the visible view with thermal picture-in-picture; when low light is detected, it switches to the fused thermal view with the visible picture-in-picture. The switch is made close to the sensors, not by the application."
          ],
          figures: [
            { media: { ...media.adaptive, alt: "Display switching between the visible view and the fused thermal view as the lighting changes" }, caption: "Highlight: visible + thermal picture-in-picture. Lowlight: fused + visible picture-in-picture." }
          ]
        },
        {
          id: "pipeline",
          title: "Process as pixels arrive",
          body: [
            "A CPU pipeline waits for the complete frame before preprocessing can start, and the application waits behind that. DODA starts on the first pixel: preprocessing overlaps the frame's arrival, so the preprocessed image is ready as soon as the last pixel lands and the application starts earlier. Same input frame, less work left for the CPU — 17× faster preprocessing on the prototype."
          ],
          figures: [{ media: { kind: "pipeline" }, caption: "Illustrative timing. CPU processing above, DODA + CPU below." }]
        },
        {
          id: "frame-sync",
          title: "Frame synchronization: DODA prototype vs. CPU baseline",
          body: [
            "With CPU-only processing the visible and thermal frames drift visibly apart. DODA aligns the frames close to the sensors and keeps them tightly synchronized."
          ],
          figures: [
            { media: { ...media.frameSync, alt: "Side-by-side: CPU-only output with drifting thermal overlay, DODA output with the overlay locked to the person", left: "CPU-only", right: "With DODA preprocessing" }, caption: "Same scene, same hardware. Left: CPU-only. Right: with DODA preprocessing." }
          ]
        },
        {
          id: "stress",
          title: "Stress test: application latency near the frame interval",
          body: [
            "As the application's latency approaches the frame interval, the CPU-only display becomes visibly laggy. With DODA doing the preprocessing, the display stays responsive."
          ],
          figures: [
            { media: { ...media.stress, alt: "Side-by-side under load: CPU-only display lagging behind the person's movement, DODA display keeping up", left: "CPU-only", right: "With DODA preprocessing" }, caption: "Under load. Left: CPU-only. Right: with DODA preprocessing." }
          ]
        }
      ],
      changelog: [
        { date: "2026-09", body: "Demo video on the FPGA prototype: synchronized visible + thermal stream, adaptive view switching, frame-synchronization and stress-test comparisons against a CPU-only baseline." }
      ]
    },
    ko: {
      title: "EdgeFuse",
      tagline: "DODA 기반 실시간 멀티센서 전처리",
      status: "FPGA 프로토타입",
      summary:
        "가시광 카메라와 열화상 센서가 FPGA에 연결되고, FPGA 위의 DODA 프로토타입이 두 스트림을 동기화·융합한 뒤에야 애플리케이션 CPU에 전달합니다. 적응형 뷰 전환, 프레임 동기화, 스트레스 테스트를 CPU 단독 처리와 나란히 비교합니다.",
      stats: [
        { value: "17×", label: "전처리 속도 향상", note: "동일 입력 프레임, DODA vs. CPU 기준선" },
        { value: "2", label: "융합된 센서 스트림", note: "가시광(EO) + 열화상(IR)" },
        { value: "45 → 9 FPS", label: "가시광 스트림 동기화", note: "열화상 센서 속도에 맞춤" },
        { value: "1280×960 → 160×120", label: "가시광 스트림 축소", note: "CPU에 도달하기 전에" }
      ],
      team: "이진호 · Tingting Xiang · Burin Amornpaisannon",
      sections: [
        {
          id: "overview",
          title: "EdgeFuse가 보여주는 것",
          body: [
            "멀티센서 인식은 늘 같은 지점에서 병목이 생깁니다. 각 센서의 원시 프레임을 메모리로 복사하고, CPU가 정렬·리사이즈한 뒤에야 애플리케이션에 넘어갑니다. EdgeFuse는 이 작업을 센서 바로 옆으로 옮깁니다. FPGA 위의 DODA 프로토타입이 가시광과 열화상 스트림을 픽셀이 도착하는 대로 받아 동기화하고, 가시광 스트림을 열화상 센서의 속도와 해상도로 낮춘 뒤, 융합되고 축소된 하나의 스트림을 애플리케이션이 실행되는 ARM 코어에 전달합니다.",
            "데모는 같은 하드웨어에서 세 장면을 실행합니다. 적응형 뷰 전환이 포함된 동기화된 가시광 + 열화상 스트림, CPU 단독 파이프라인과의 프레임 동기화 비교, 그리고 애플리케이션 지연을 프레임 간격까지 끌어올리는 스트레스 테스트입니다."
          ]
        },
        {
          id: "setup",
          title: "하드웨어와 구성",
          body: [
            "모든 것이 ARM Cortex-A53이 탑재된 FPGA SoC 보드 한 장에서 동작합니다. 열화상(IR) 센서와 가시광(EO) 카메라는 보드에 직접 연결되며, DODA 프로토타입은 FPGA 패브릭에, 애플리케이션은 A53에서 실행됩니다. 보드는 융합 출력을 디스플레이로 내보내고 UART로 로그를 남깁니다."
          ],
          figures: [
            { media: { ...media.hardware, alt: "왼쪽에 열화상 센서, 오른쪽에 가시광 카메라가 연결된 FPGA SoC 보드" }, caption: "열화상(IR) 센서와 가시광(EO) 카메라가 연결된 FPGA + ARM Cortex-A53 보드." },
            { media: { ...media.setup, alt: "벤치 구성: 융합 출력을 보여주는 모니터, UART 로그 화면, 책상 위의 보드와 센서" }, caption: "벤치: FPGA 디스플레이 출력(위), UART 출력(왼쪽), FPGA + 센서(오른쪽)." }
          ]
        },
        {
          id: "adaptive",
          title: "동기화된 스트림과 적응형 뷰 전환",
          body: [
            "가시광 스트림(45 FPS, 1280×960)은 융합 전에 열화상 센서의 9 FPS, 160×120에 맞춰 동기화되므로 두 뷰는 항상 같은 순간을 보여줍니다. 밝은 환경에서는 가시광 뷰에 열화상 PIP를, 저조도가 감지되면 융합된 열화상 뷰에 가시광 PIP를 표시합니다. 이 전환은 애플리케이션이 아니라 센서 가까이에서 이루어집니다."
          ],
          figures: [
            { media: { ...media.adaptive, alt: "조명 변화에 따라 가시광 뷰와 융합된 열화상 뷰 사이를 전환하는 디스플레이" }, caption: "밝은 환경: 가시광 + 열화상 PIP. 저조도: 융합 + 가시광 PIP." }
          ]
        },
        {
          id: "pipeline",
          title: "픽셀이 도착하는 대로 처리",
          body: [
            "CPU 파이프라인은 프레임 전체가 도착해야 전처리를 시작할 수 있고, 애플리케이션은 그 뒤에서 기다립니다. DODA는 첫 픽셀부터 시작합니다. 전처리가 프레임 도착과 겹쳐 진행되므로 마지막 픽셀이 도착하는 순간 전처리된 이미지가 준비되고, 애플리케이션이 더 일찍 시작합니다. 같은 입력 프레임, CPU에 남는 일은 더 적게 — 프로토타입에서 전처리 17× 가속."
          ],
          figures: [{ media: { kind: "pipeline" }, caption: "개념적 타이밍. 위는 CPU 처리, 아래는 DODA + CPU." }]
        },
        {
          id: "frame-sync",
          title: "프레임 동기화: DODA 프로토타입 vs. CPU 기준선",
          body: [
            "CPU 단독 처리에서는 가시광과 열화상 프레임이 눈에 띄게 어긋납니다. DODA는 센서 가까이에서 프레임을 정렬해 두 프레임을 단단히 동기화합니다."
          ],
          figures: [
            { media: { ...media.frameSync, alt: "나란히 비교: 열화상 오버레이가 어긋나는 CPU 단독 출력과 사람에 고정된 DODA 출력", left: "CPU 단독", right: "DODA 전처리 적용" }, caption: "같은 장면, 같은 하드웨어. 왼쪽: CPU 단독. 오른쪽: DODA 전처리 적용." }
          ]
        },
        {
          id: "stress",
          title: "스트레스 테스트: 프레임 간격에 근접한 애플리케이션 지연",
          body: [
            "애플리케이션 지연이 프레임 간격에 가까워지면 CPU 단독 디스플레이는 눈에 띄게 끊깁니다. DODA가 전처리를 맡으면 디스플레이는 계속 반응합니다."
          ],
          figures: [
            { media: { ...media.stress, alt: "부하 상태에서 나란히 비교: 사람의 움직임에 뒤처지는 CPU 단독 디스플레이와 따라가는 DODA 디스플레이", left: "CPU 단독", right: "DODA 전처리 적용" }, caption: "부하 상태. 왼쪽: CPU 단독. 오른쪽: DODA 전처리 적용." }
          ]
        }
      ],
      changelog: [
        { date: "2026-09", body: "FPGA 프로토타입 데모 영상: 동기화된 가시광 + 열화상 스트림, 적응형 뷰 전환, CPU 단독 기준선과의 프레임 동기화 및 스트레스 테스트 비교." }
      ]
    }
  }
};
