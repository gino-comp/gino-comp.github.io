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
    about: "About",
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

// The founder bio lists the PCT filings; derive them from the patents list
// so the bio and the Research page can never disagree.
const patentEntries = common.patents.map((patent) => `${patent.code} — ${patent.title}`);

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
    about: {
      kicker: "ABOUT US",
      title: "Researchers building what they invented.",
      desc:
        "RiDM is an NUS spin-off founded by computer architecture researchers and a business lead from NUS. The founding team that did the underlying research remains directly involved in architecture, implementation and commercialization.",
      teamKicker: "TEAM",
      teamTitle: "The people behind DODA.",
      overview: "2 PhDs · 1 PhD Candidate · 1 MBA · 2 IC Designers",
      collapse: "Show less",
      expand: "Show more",
      websiteLabel: "Website",
      lead: {
        role: "CEO & Co-founder",
        name: "Jinho Lee, PhD",
        school: "NUS School of Computing",
        portrait: "/team/jinho-lee.jpg",
        links: [],
        details: [
          ["Research", "General-purpose dynamic dataflow processing and reconfigurable computer architecture."],
          ["IP", patentEntries],
          ["Role", "Company strategy, architecture direction and commercialization."]
        ]
      },
      groups: [
        {
          label: "Singapore",
          entity: "RiDM PTE. LTD.",
          note: "Core IP development",
          members: [
            {
              role: "CTO & Co-founder",
              name: "Tingting Xiang",
              school: "NUS PhD Candidate",
              portrait: null,
              links: [{ type: "linkedin", href: "https://www.linkedin.com/in/tingting-xiang-98a051179/" }],
              details: [
                ["Research", "AI accelerator design and optimization for sparse data environments."],
                ["Focus", "AI workload analysis and hardware optimization."],
                ["Role", "Leads the company’s technical direction across architecture and implementation, alongside AI accelerator research."]
              ]
            },
            {
              role: "CFO & Co-founder",
              name: "Xiaoqing (Serena) Xie, MBA",
              school: "NUS MBA",
              portrait: null,
              links: [{ type: "linkedin", href: "https://www.linkedin.com/in/serena-xie-a6a8986/" }],
              details: [
                ["Background", "NUS MBA with responsibility for finance, strategy and operations."],
                ["Focus", "Finance, fundraising, investor relations and corporate operations."],
                ["Role", "Financial management and commercialization support."]
              ]
            },
            {
              role: "Co-founder · Advisor",
              name: "Trevor E. Carlson, PhD",
              school: "Associate Professor, NUS",
              portrait: null,
              links: [{ type: "website", href: "https://www.comp.nus.edu.sg/~tcarlson/" }],
              details: [
                ["Research", "Computer architecture and related systems research."],
                ["Background", "NUS Associate Professor and academic advisor to the founding research team."],
                ["Role", "Technical advisor and research continuity."]
              ]
            }
          ]
        },
        {
          label: "Korea",
          entity: "RiDM Korea",
          note: "Silicon implementation and business development",
          members: [
            {
              role: "IC Designer",
              name: "Moon Junghyun",
              school: "Kyung Hee University",
              portrait: null,
              links: [],
              details: [
                ["Focus", "Analog IC design."],
                ["Education", "MS in Electrical Engineering, Kyung Hee University."],
                ["Tape-outs", "Four tape-outs through Samsung 28nm MPW shuttles during her master’s."]
              ]
            },
            {
              role: "IC Designer",
              name: "Yu Youngjun",
              school: "Ajou University",
              portrait: null,
              links: [],
              details: [
                ["Focus", "Analog and mixed-signal IC design."],
                ["Education", "MS in Intelligence Semiconductor Engineering, Ajou University."],
                ["Tape-outs", "Two tape-outs through TSMC 130nm MPW shuttles."]
              ]
            }
          ]
        }
      ],
      story: {
        kicker: "ORIGIN",
        title: "It started in a computer architecture lab.",
        body: [
          "RiDM began at the National University of Singapore, inside Trevor E. Carlson’s Computer Architecture Group. The founding team spent years there researching faster and more efficient computer architectures together, and the dynamic dataflow work that became DODA existed as published research and PCT filings long before it was a product.",
          "In 2023 the team graduated from NUS GRIP, the university’s flagship deep-tech startup incubation programme, now National GRIP. RiDM carries that architecture from research toward silicon with the same people who designed it."
        ]
      },
      milestonesKicker: "MILESTONES",
      milestonesTitle: "From lab to company.",
      milestones: [
        {
          year: "2023",
          title: "Graduated NUS GRIP",
          body: "Completed the National University of Singapore’s flagship deep-tech startup incubation programme, now National GRIP."
        },
        {
          year: "2026",
          title: "Seed round",
          body: "Secured seed funding from Qube Research & Technologies and The Invention Lab."
        },
        {
          year: "2026",
          title: "RiDM Korea · TIPS",
          body: "Opened the RiDM Korea subsidiary and secured a TIPS R&D grant."
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
    about: {
      kicker: "회사 소개",
      title: "핵심 기술을 연구한 팀이 직접 만듭니다.",
      desc:
        "RiDM은 NUS 컴퓨터 아키텍처 연구진과 NUS MBA 출신 사업 담당자가 함께 설립한 NUS Spin-off입니다. 핵심 기술을 직접 연구한 공동창업자들이 아키텍처 구현과 사업화까지 이어가고 있습니다.",
      teamKicker: "TEAM",
      teamTitle: "DODA를 만드는 사람들.",
      overview: "PhD 2인 · PhD Candidate 1인 · MBA 1인 · IC 설계 2인",
      collapse: "간략히",
      expand: "자세히",
      websiteLabel: "웹사이트",
      lead: {
        role: "CEO & Co-founder",
        name: "이진호, PhD",
        school: "NUS School of Computing",
        portrait: "/team/jinho-lee.jpg",
        links: [],
        details: [
          ["연구분야", "General-purpose Dynamic Dataflow Processing, Reconfigurable Computer Architecture"],
          ["IP", patentEntries],
          ["담당", "회사 전략, 아키텍처 방향성 및 사업화 총괄"]
        ]
      },
      groups: [
        {
          label: "싱가포르",
          entity: "RiDM PTE. LTD.",
          note: "핵심 IP 개발",
          members: [
            {
              role: "CTO & Co-founder",
              name: "Tingting Xiang",
              school: "NUS PhD Candidate",
              portrait: null,
              links: [{ type: "linkedin", href: "https://www.linkedin.com/in/tingting-xiang-98a051179/" }],
              details: [
                ["연구분야", "Sparse Data 환경의 AI 가속기 설계 및 최적화"],
                ["주요업무", "AI Workload 분석 및 Hardware Optimization"],
                ["담당", "AI 가속기 연구와 함께 아키텍처·구현 등 회사 기술 부문 총괄"]
              ]
            },
            {
              role: "CFO & Co-founder",
              name: "Xiaoqing (Serena) Xie, MBA",
              school: "NUS MBA",
              portrait: null,
              links: [{ type: "linkedin", href: "https://www.linkedin.com/in/serena-xie-a6a8986/" }],
              details: [
                ["학력", "NUS MBA"],
                ["주요업무", "재무, 투자 유치, 투자자 커뮤니케이션 및 경영 관리"],
                ["담당", "재무 총괄 및 사업화 지원"]
              ]
            },
            {
              role: "Co-founder · Advisor",
              name: "Trevor E. Carlson, PhD",
              school: "Associate Professor, NUS",
              portrait: null,
              links: [{ type: "website", href: "https://www.comp.nus.edu.sg/~tcarlson/" }],
              details: [
                ["연구분야", "Computer Architecture 및 관련 시스템 연구"],
                ["주요경력", "NUS 부교수이자 창업 연구팀의 지도교수"],
                ["담당", "Technical Advisor 및 연구 연속성 지원"]
              ]
            }
          ]
        },
        {
          label: "한국",
          entity: "RiDM Korea",
          note: "실리콘 구현 및 사업 개발",
          members: [
            {
              role: "IC Designer",
              name: "문정현",
              school: "경희대학교",
              portrait: null,
              links: [],
              details: [
                ["주요분야", "아날로그 IC 설계"],
                ["학력", "경희대학교 전자공학 석사"],
                ["Tape-out", "석사 과정 중 삼성 28nm MPW 셔틀을 통해 4회 tape-out 수행"]
              ]
            },
            {
              role: "IC Designer",
              name: "유영준",
              school: "아주대학교",
              portrait: null,
              links: [],
              details: [
                ["주요분야", "아날로그·혼성신호 IC 설계"],
                ["학력", "아주대학교 지능형반도체공학 석사"],
                ["Tape-out", "TSMC 130nm MPW 셔틀을 통해 2회 tape-out 수행"]
              ]
            }
          ]
        }
      ],
      story: {
        kicker: "ORIGIN",
        title: "컴퓨터 아키텍처 연구실에서 시작했습니다.",
        body: [
          "RiDM은 싱가포르국립대학교(NUS) Trevor E. Carlson 교수의 Computer Architecture Group에서 시작되었습니다. 창업팀은 이곳에서 더 빠르고 효율적인 컴퓨터 아키텍처를 함께 연구했으며, DODA의 바탕이 된 Dynamic Dataflow 연구는 제품이 되기 전에 이미 논문과 PCT 특허로 축적되었습니다.",
          "2023년에는 NUS의 대표 딥테크 창업 인큐베이션 프로그램인 NUS GRIP(현 National GRIP)을 성공적으로 졸업했습니다. 아키텍처를 직접 설계한 구성원들이 연구 단계에서 실리콘까지 그대로 이어가고 있습니다."
        ]
      },
      milestonesKicker: "MILESTONES",
      milestonesTitle: "연구실에서 회사로.",
      milestones: [
        {
          year: "2023",
          title: "NUS GRIP 졸업",
          body: "NUS의 대표 딥테크 창업 인큐베이션 프로그램인 NUS GRIP(현 National GRIP)을 성공적으로 졸업했습니다."
        },
        {
          year: "2026",
          title: "시드 투자 유치",
          body: "Qube Research & Technologies와 The Invention Lab으로부터 시드 라운드 투자를 유치했습니다."
        },
        {
          year: "2026",
          title: "RiDM Korea 설립 · TIPS 선정",
          body: "자회사 RiDM Korea를 설립하고 TIPS R&D 과제에 선정되었습니다."
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

// The two locale dictionaries are structurally identical but have distinct
// literal types, so components read the shared shapes through these instead of
// mapping over a union of readonly tuples.
export type TeamLink = { type: "linkedin" | "website"; href: string };

export type TeamMember = {
  role: string;
  name: string;
  school: string;
  portrait: string | null;
  links: readonly TeamLink[];
  // A detail value is either a sentence or a list of lines, so the founder's
  // IP row can enumerate the PCT filings.
  details: readonly (readonly [string, string | readonly string[]])[];
};

export type TeamGroup = { label: string; entity: string; note: string; members: readonly TeamMember[] };

export type Milestone = { year: string; title: string; body: string };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
