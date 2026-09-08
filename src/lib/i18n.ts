export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ridm.tech";

const common = {
  nav: {
    technology: "DODA",
    applications: "Applications",
    research: "Research",
    company: "Company",
    contact: "Contact"
  },
  applications: [
    {
      key: "networking",
      title: "Low-Latency Networking",
      tags: ["SmartNIC", "HFT", "Market Data"]
    },
    {
      key: "sensing",
      title: "Sensing Systems",
      tags: ["Sonar", "UWB", "Beamforming"]
    },
    {
      key: "robotics",
      title: "Robotics",
      tags: ["Multi-Sensor", "Sensor Fusion", "Control"]
    },
    {
      key: "edge",
      title: "Edge AI",
      tags: ["Filtering", "Pre-processing", "Inference"]
    }
  ],
  papers: [
    {
      year: "2021",
      title: "Ultra-Fast CGRA Scheduling to Enable Run-Time Programmable CGRAs",
      authors: "Jinho Lee · Trevor E. Carlson · NUS",
      tag: "CGRA Scheduling"
    },
    {
      year: "2022",
      title: "GraphWave: A Highly-Parallel Compute-at-Memory Graph Processing Accelerator",
      authors: "Jinho Lee · Burin Amornpaisannon · Tulika Mitra · Trevor E. Carlson · DATE 2022",
      tag: "Compute-at-Memory"
    },
    {
      year: "2023",
      title: "3DRA: Dynamic Data-Driven Reconfigurable Architecture",
      authors: "Jinho Lee · Burin Amornpaisannon · Andreas Diavastos · Trevor E. Carlson · IEEE Access",
      tag: "Dynamic Dataflow",
      href: "https://doi.org/10.1109/ACCESS.2023.3319404"
    }
  ],
  patents: [
    {
      code: "WO2023/234867",
      title: "Reconfigurable Computing Architecture"
    },
    {
      code: "WO2024/242626 A1",
      title: "Hierarchical Network Design for Dynamic Dataflow Style Architectures"
    },
    {
      code: "WO2026/015086 A1",
      title: "Adaptive and Reconfigurable Dataflow Computing System and Method"
    }
  ]
};

export const dictionaries = {
  en: {
    ...common,
    meta: {
      title: "RiDM Technology | DODA Near-Sensor Computing Architecture",
      description:
        "RiDM Technology develops DODA, a runtime-programmable dataflow architecture for near-sensor processing, rooted in NUS computer architecture research."
    },
    brandSub: "Programmable Near-Sensor Computing",
    hero: {
      label: "RUNTIME-PROGRAMMABLE NEAR-SENSOR PROCESSOR",
      lead: "Compute closer to",
      accent: "where data begins.",
      body:
        "RiDM develops DODA, a programmable dataflow architecture designed to process sensing data closer to its source before it becomes a system-level data movement problem.",
      ctaPrimary: "Explore DODA",
      ctaSecondary: "Research & IP",
      builtFor: "BUILT FOR",
      stageTitle: "SYSTEM FLOW",
      stageNote: "Illustrative architecture",
      sensorSub1: "Vision · Radar · UWB",
      sensorSub2: "Industrial sensors",
      hostSub: "System-level workloads"
    },
    index: [
      ["01", "DODA Architecture", "Dynamic data-driven execution"],
      ["02", "FPGA Overlay", "R&D and early commercialization path"],
      ["03", "Silicon Roadmap", "From architecture IP to dedicated silicon"]
    ],
    explore: {
      kicker: "EXPLORE",
      title: "Go deeper.",
      desc: "The architecture, application areas, research foundation and team each have a dedicated page.",
      more: "Learn more"
    },
    technology: {
      kicker: "01 / WHY NEAR-SENSOR",
      title: "Move less data. React sooner.",
      desc:
        "In sensing-intensive systems, raw streams are continuously transported to central processors. RiDM moves part of that processing closer to the point where data is generated.",
      conventional: {
        overline: "CONVENTIONAL FLOW",
        title: "Move raw data to central compute.",
        body:
          "Sensor streams travel through the system before filtering, fusion or inference takes place.",
        caption: "More sensors increase traffic, host load and latency pressure."
      },
      ridm: {
        overline: "RiDM APPROACH",
        title: "Process data closer to the source.",
        body:
          "DODA is designed to filter, fuse and process sensor data before forwarding higher-value data to the host processor.",
        caption: "Programmability allows the processing pipeline to change with the workload."
      }
    },
    doda: {
      kicker: "02 / DODA ARCHITECTURE",
      title: "Efficiency and programmability in one architecture.",
      desc:
        "DODA extends RiDM’s dynamic dataflow research toward a runtime-programmable architecture for near-sensor processing.",
      fullName: "DYNAMIC, ON-DEMAND DATAFLOW ARCHITECTURE",
      body:
        "Designed to execute work as data becomes available, reduce dependence on rigid static scheduling and support changing sensing workloads.",
      priorities: [
        {
          n: "01",
          title: "Efficiency",
          body:
            "Near-sensor processing is intended to reduce unnecessary data movement and host-side processing overhead."
        },
        {
          n: "02",
          title: "Runtime Programmability",
          body:
            "A programmable execution model is designed for workloads that change faster than fixed-function silicon."
        },
        {
          n: "03",
          title: "Developer Usability",
          body:
            "RiDM’s R&D roadmap includes tooling intended to lower the barrier to programming the architecture."
        }
      ],
      proof: [
        ["NUS", "Research-origin spin-off"],
        ["3", "PCT patent families"],
        ["3", "Selected research works"],
        ["FPGA → Silicon", "Commercialization path"]
      ]
    },
    applicationsCopy: {
      kicker: "03 / APPLICATIONS",
      title: "Built for sensing-intensive systems.",
      desc: "Four initial application areas reflect where RiDM’s architecture can be evaluated first.",
      bodies: {
        networking:
          "SmartNIC, HFT and market-data pipelines where transport and processing latency matter.",
        sensing:
          "Sonar, UWB, beamforming and imaging pipelines that benefit from localized filtering and fusion.",
        robotics:
          "Multi-sensor systems and time-sensitive control loops that require efficient sensor fusion.",
        edge:
          "Filtering, pre-processing and selective inference before data reaches the next compute layer."
      }
    },
    researchCopy: {
      kicker: "04 / RESEARCH & IP",
      title: "The research behind DODA.",
      desc:
        "RiDM’s architecture is rooted in NUS research on CGRA scheduling, compute-at-memory and dynamic data-driven reconfigurable architectures.",
      ipKicker: "CORE IP",
      ipTitle: "NUS research, exclusively licensed to RiDM.",
      ipBody:
        "Three PCT patent families originated from the founders’ NUS research, and RiDM holds an exclusive license to the core IP."
    },
    company: {
      kicker: "05 / COMPANY",
      title: "Researchers building what they invented.",
      desc:
        "RiDM is an NUS spin-off founded by researchers in computer architecture and a business lead from NUS. The founding team remains directly involved in architecture, implementation and commercialization.",
      overview: "3 PhDs · 1 PhD Candidate · 1 MBA",
      overviewNote: "Expand each profile for research background and current role.",
      team: [
        {
          role: "CEO & Co-founder",
          name: "Jinho Lee, PhD",
          school: "NUS School of Computing",
          details: [
            ["Research", "General-purpose dynamic dataflow processing and reconfigurable computer architecture."],
            ["IP", "Lead inventor on RiDM’s three core PCT patent filings."],
            ["Role", "Company strategy, architecture direction and commercialization."]
          ]
        },
        {
          role: "Co-founder · Architecture",
          name: "Burin Amornpaisannon, PhD",
          school: "NUS School of Computing",
          details: [
            ["Research", "Reconfigurable architecture, AI acceleration and hardware implementation."],
            ["IP", "Core architecture co-invention and RTL design / verification."],
            ["Role", "Architecture implementation, RTL design and verification."]
          ]
        },
        {
          role: "Co-founder · AI Accelerator Research",
          name: "Tingting Xiang",
          school: "NUS PhD Candidate",
          details: [
            ["Research", "AI accelerator design and optimization for sparse data environments."],
            ["Focus", "AI workload analysis and hardware optimization."],
            ["Role", "Application-oriented accelerator research and optimization."]
          ]
        },
        {
          role: "Co-founder · Business",
          name: "Xiaoqing (Serena) Xie, MBA",
          school: "NUS MBA",
          details: [
            ["Background", "NUS MBA with responsibility for business development, strategy and operations."],
            ["Focus", "Business development, strategy, operations and investor communication."],
            ["Role", "Business operations and commercialization support."]
          ]
        },
        {
          role: "Co-founder · Advisor",
          name: "Trevor E. Carlson, PhD",
          school: "Associate Professor, NUS",
          details: [
            ["Research", "Computer architecture and related systems research."],
            ["Background", "NUS Associate Professor and academic advisor to the founding research team."],
            ["Role", "Technical advisor and research continuity."]
          ]
        }
      ]
    },
    contact: {
      kicker: "CONTACT",
      title: "Work with RiDM.",
      body: "Technology evaluation, licensing, joint development and research collaboration.",
      cta: "Contact RiDM"
    }
  },
  ko: {
    ...common,
    meta: {
      title: "RiDM Technology | DODA Near-Sensor Computing Architecture",
      description:
        "RiDM Technology는 NUS 컴퓨터 아키텍처 연구를 기반으로 Near-Sensor Processing용 Runtime Programmable Dataflow Architecture, DODA를 개발합니다."
    },
    brandSub: "Programmable Near-Sensor Computing",
    hero: {
      label: "RUNTIME-PROGRAMMABLE NEAR-SENSOR PROCESSOR",
      lead: "이동하는 데이터에",
      accent: "연산을 더하다.",
      body:
        "RiDM은 센서 가까이에서 데이터를 먼저 처리하는 Runtime Programmable Dataflow Architecture, DODA를 개발합니다. 필요한 연산을 데이터 발생 지점에 가깝게 배치해 중앙 CPU/GPU로 이동하는 데이터와 처리 부담을 줄입니다.",
      ctaPrimary: "DODA 기술 보기",
      ctaSecondary: "연구·특허 보기",
      builtFor: "BUILT FOR",
      stageTitle: "SYSTEM FLOW",
      stageNote: "개념 아키텍처",
      sensorSub1: "Vision · Radar · UWB",
      sensorSub2: "산업용 센서",
      hostSub: "상위 시스템 연산"
    },
    index: [
      ["01", "DODA Architecture", "Dynamic Data-Driven Execution"],
      ["02", "FPGA Overlay", "초기 검증 및 사업화 경로"],
      ["03", "Silicon Roadmap", "Architecture IP에서 전용 Silicon으로"]
    ],
    explore: {
      kicker: "EXPLORE",
      title: "더 깊이 살펴보기.",
      desc: "아키텍처, 응용 분야, 연구 기반, 팀 소개는 각 페이지에서 자세히 확인할 수 있습니다.",
      more: "자세히 보기"
    },
    technology: {
      kicker: "01 / WHY NEAR-SENSOR",
      title: "데이터 이동은 줄이고, 반응은 더 빠르게.",
      desc:
        "센서가 늘어날수록 중앙 CPU/GPU로 이동하는 원시 데이터도 함께 증가합니다. RiDM은 필터링·융합·전처리 등 필요한 연산을 센서 가까이에서 먼저 수행합니다.",
      conventional: {
        overline: "CONVENTIONAL FLOW",
        title: "원시 데이터를 중앙으로 이동",
        body:
          "센서 데이터가 시스템을 이동한 뒤 중앙 CPU/GPU에서 필터링·융합·추론이 이루어집니다.",
        caption: "센서 수가 늘면 데이터 이동량, Host 부하, 지연 부담도 함께 커집니다."
      },
      ridm: {
        overline: "RiDM APPROACH",
        title: "센서 가까이에서 필요한 연산을 먼저",
        body:
          "DODA는 센서 데이터를 먼저 필터링·융합·처리하고, 필요한 데이터만 Host Processor로 전달하도록 설계됩니다.",
        caption: "Runtime Programmability를 기반으로 알고리즘과 워크로드 변화에 대응합니다."
      }
    },
    doda: {
      kicker: "02 / DODA ARCHITECTURE",
      title: "효율성과 프로그래머빌리티를 하나의 아키텍처로.",
      desc:
        "DODA는 RiDM의 Dynamic Dataflow 연구를 Near-Sensor Processing으로 확장한 Runtime Programmable Architecture입니다.",
      fullName: "DYNAMIC, ON-DEMAND DATAFLOW ARCHITECTURE",
      body:
        "데이터가 준비되는 시점에 연산을 실행해 정적 스케줄링 의존도를 낮추고, 변화하는 센싱 워크로드에 대응합니다.",
      priorities: [
        {
          n: "01",
          title: "Efficiency",
          body: "센서 가까이에서 필요한 연산을 수행해 불필요한 데이터 이동과 Host 처리 부담을 줄입니다."
        },
        {
          n: "02",
          title: "Runtime Programmability",
          body: "고정 기능 Silicon으로 대응하기 어려운 빠른 알고리즘·워크로드 변화에 맞춰 재구성할 수 있습니다."
        },
        {
          n: "03",
          title: "Developer Usability",
          body: "프로그래밍과 검증에 필요한 도구를 함께 개발해 전용 하드웨어 활용의 진입장벽을 낮추고 있습니다."
        }
      ],
      proof: [
        ["NUS", "Research-origin Spin-off"],
        ["3", "PCT 특허"],
        ["3", "주요 연구 성과"],
        ["FPGA → Silicon", "사업화 로드맵"]
      ]
    },
    applicationsCopy: {
      kicker: "03 / APPLICATIONS",
      title: "센서 데이터가 많은 환경부터.",
      desc: "RiDM은 데이터 이동량과 지연이 시스템 성능에 직접 영향을 주는 네 가지 영역을 우선 적용 분야로 보고 있습니다.",
      bodies: {
        networking: "SmartNIC, HFT, 시장 데이터 처리처럼 전송 및 처리 지연이 중요한 네트워크 워크로드",
        sensing: "Sonar, UWB, Beamforming, Imaging 등 센서 가까이에서 필터링과 데이터 융합이 필요한 워크로드",
        robotics: "다중 센서와 실시간 제어가 필요한 로보틱스 환경에서의 Sensor Fusion 처리",
        edge: "상위 연산 계층으로 데이터를 전달하기 전 Filtering, Pre-processing, 선택적 Inference 처리"
      }
    },
    researchCopy: {
      kicker: "04 / RESEARCH & IP",
      title: "DODA의 기반이 된 연구와 IP",
      desc:
        "RiDM의 기술은 NUS에서 수행한 CGRA Scheduling, Compute-at-Memory, Dynamic Data-Driven Reconfigurable Architecture 연구에서 출발했습니다.",
      ipKicker: "CORE IP",
      ipTitle: "NUS 연구에서 출발한 핵심 IP",
      ipBody:
        "공동창업자들의 NUS 연구에서 출발한 PCT 특허 3건이 핵심 IP를 구성하며, RiDM은 해당 IP에 대한 독점 라이선스를 보유하고 있습니다."
    },
    company: {
      kicker: "05 / COMPANY",
      title: "핵심 기술을 연구한 팀이 직접 만듭니다.",
      desc:
        "RiDM은 NUS 컴퓨터 아키텍처 연구진과 NUS MBA 출신 사업 담당자가 함께 설립한 NUS Spin-off입니다. 핵심 기술을 연구한 공동창업자들이 아키텍처 구현과 사업화까지 직접 참여합니다.",
      overview: "PhD 3인 · PhD Candidate 1인 · MBA 1인",
      overviewNote: "각 프로필을 열면 연구분야와 담당 역할을 확인할 수 있습니다.",
      team: [
        {
          role: "CEO & Co-founder",
          name: "이진호, PhD",
          school: "NUS School of Computing",
          details: [
            ["연구분야", "General-purpose Dynamic Dataflow Processing, Reconfigurable Computer Architecture"],
            ["IP", "핵심 PCT 특허 3건의 Lead Inventor"],
            ["담당", "회사 전략, 아키텍처 방향성 및 사업화 총괄"]
          ]
        },
        {
          role: "Co-founder · Architecture",
          name: "Burin Amornpaisannon, PhD",
          school: "NUS School of Computing",
          details: [
            ["연구분야", "재구성형 아키텍처, AI 가속기 및 하드웨어 구현"],
            ["IP", "핵심 아키텍처 공동 발명 및 RTL 설계·검증"],
            ["담당", "아키텍처 구현, RTL 설계 및 검증"]
          ]
        },
        {
          role: "Co-founder · AI Accelerator Research",
          name: "Tingting Xiang",
          school: "NUS PhD Candidate",
          details: [
            ["연구분야", "Sparse Data 환경의 AI 가속기 설계 및 최적화"],
            ["주요업무", "AI Workload 분석 및 Hardware Optimization"],
            ["담당", "응용 워크로드 기반 가속기 연구 및 최적화"]
          ]
        },
        {
          role: "Co-founder · Business",
          name: "Xiaoqing (Serena) Xie, MBA",
          school: "NUS MBA",
          details: [
            ["학력", "NUS MBA"],
            ["주요업무", "사업개발, 전략, 운영 및 투자자 커뮤니케이션"],
            ["담당", "사업개발·운영 및 사업화 지원"]
          ]
        },
        {
          role: "Co-founder · Advisor",
          name: "Trevor E. Carlson, PhD",
          school: "Associate Professor, NUS",
          details: [
            ["연구분야", "Computer Architecture 및 관련 시스템 연구"],
            ["주요경력", "NUS 부교수이자 창업 연구팀의 지도교수"],
            ["담당", "Technical Advisor 및 연구 연속성 지원"]
          ]
        }
      ]
    },
    contact: {
      kicker: "CONTACT",
      title: "RiDM과 협업을 논의해보세요.",
      body: "기술 검토, 라이선스, 공동개발, 연구 협력 관련 논의를 환영합니다.",
      cta: "Contact RiDM"
    }
  }
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
