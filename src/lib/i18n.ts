export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ridm.tech";

const common = {
  nav: {
    technology: "Technology",
    applications: "Applications",
    research: "Research",
    news: "What’s New",
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
  ],
  // Announcement spine. Dates, categories and outbound links are facts rather
  // than copy, so they live here once and only the prose is translated, in
  // `newsCopy.items` under each locale. `date` carries only the precision we
  // actually have — "2026", "2026-03" or "2026-03-14" — and the page renders
  // and sorts each entry at that precision.
  news: [
    { key: "koreaTips", date: "2026", category: "Company" },
    { key: "seedRound", date: "2026", category: "Funding" },
    { key: "patent2026", date: "2026", category: "IP" },
    { key: "patent2024", date: "2024", category: "IP" },
    { key: "grip", date: "2023", category: "Company" },
    { key: "patent2023", date: "2023", category: "IP" }
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
      ["01", "DODA Architecture", "Dynamically orchestrated dataflow"],
      ["02", "FPGA Overlay", "R&D and early commercialization path"],
      ["03", "Silicon Roadmap", "From architecture IP to dedicated silicon"]
    ],
    explore: {
      kicker: "EXPLORE",
      title: "Go deeper.",
      desc:
        "The architecture, application areas, research foundation, team and latest updates each have a dedicated page.",
      more: "Learn more"
    },
    technology: {
      kicker: "01 / WHY NEAR-SENSOR",
      title: "Move less data. React sooner.",
      desc:
        "In sensing-intensive systems every raw stream is written to shared memory, pre-processed by the CPU, written back, and only then read by the accelerator. RiDM does that work where the data is produced.",
      diagramNote: "Illustrative data path",
      sensorsLabel: "SENSORS",
      conventional: {
        overline: "CONVENTIONAL FLOW",
        title: "Every stream arrives at once. The CPU takes them one at a time.",
        sensors: ["Camera", "Radar", "UWB", "Lidar"],
        memory: { name: "DRAM / shared memory", note: "every raw frame lands here first" },
        compute: [
          { name: "CPU", note: "filter · decode · resize · format" },
          { name: "GPU / NPU", note: "inference" }
        ],
        edges: { ingest: "all streams, in parallel", cpu: "read one · write back", infer: "read again" },
        costs: ["Longer reaction time — every result waits on four memory trips", "Delay that varies frame to frame — each stream waits its turn on the CPU", "Adding a sensor degrades latency for all of them"]
      },
      ridm: {
        overline: "RiDM APPROACH",
        title: "Every stream arrives at once. They get processed that way too.",
        sensors: ["Camera", "Radar", "UWB", "Lidar"],
        processor: {
          name: "Near-Sensor Processor",
          note: ["one module per stream, each its own work", "results fused before they leave"],
          modules: ["resize · crop · slice", "distance (long range)", "indoor localization", "distance (short range)"]
        },
        memory: { name: "DRAM / shared memory", note: "reduced, higher-value data" },
        accel: { name: "GPU / NPU", note: "inference" },
        edges: { reduced: "fused · reduced", infer: "read once" },
        costs: ["Shorter path to a result — data is reduced before it reaches memory", "Steadier delay — no stream waits its turn behind another", "Host latency is designed to hold as sensors are added"]
      }
    },
    doda: {
      kicker: "02 / DODA ARCHITECTURE",
      title: "A dataflow machine, orchestrated at runtime.",
      desc:
        "DODA runs an operation when its data is ready, rather than following a schedule fixed when the program was compiled. The pipeline can be rebuilt for a new workload without new silicon.",
      acronym: {
        kicker: "DODA STANDS FOR",
        expansion: [
          ["D", "ynamically"],
          ["O", "rchestrated"],
          ["D", "ataflow"],
          ["A", "rchitecture"]
        ],
        note:
          "Orchestration happens as data arrives, not ahead of time. That is the difference between a dataflow machine and a fixed pipeline."
      },
      lineageKicker: "LINEAGE",
      lineageTitle: "From a PhD thesis to filed IP.",
      lineage: [
        {
          step: "RESEARCH",
          title: "Toward General-Purpose Dynamic Dataflow Processing",
          body: "Jinho Lee’s PhD research at NUS, pursuing a general-purpose dataflow architecture that is both fast and efficient.",
          href: "https://scholarbank.nus.edu.sg/entities/publication/5a4c1379-bfae-40b1-a98a-e2ede9c855aa",
          linkLabel: "NUS ScholarBank"
        },
        {
          step: "FILED",
          title: "Three PCT patent families",
          body: "Covering the core architecture, its interconnect, and runtime reconfiguration.",
          href: null,
          linkLabel: null
        }
      ],
      simulator: {
        kicker: "TRY IT",
        title: "Run a program on DODA.",
        body:
          "doda_simulation is a Verilator-based simulator of the architecture. A small compiler captures a lambda from your code and runs it on DODA, and because the machine executes dataflow graphs you can hand it one directly. A few example graphs are included.",
        href: "https://github.com/gino-comp/doda_simulation",
        cta: "doda_simulation on GitHub"
      }
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
    newsCopy: {
      kicker: "WHAT’S NEW",
      title: "Announcements and research updates.",
      desc:
        "Company milestones, patent publications and research output from the founding team, newest first.",
      latest: "LATEST",
      link: "Read more",
      items: {
        koreaTips: {
          title: "RiDM Korea opens, TIPS R&D grant secured",
          body:
            "The Korea subsidiary takes on silicon implementation and business development, and RiDM was selected for a TIPS R&D grant.",
          href: "https://www.linkedin.com/posts/jinho-lee-phd-200a1212a_big-news-for-ridm-we-are-incredibly-activity-7483049570373955584-wvhT",
          linkLabel: "Announcement on LinkedIn"
        },
        seedRound: {
          title: "Seed round closed",
          body:
            "Seed funding from Qube Research & Technologies and The Invention Lab, to carry the architecture from research toward silicon.",
          href: "https://www.kspost.biz/en-us/articles/2326",
          linkLabel: "KSPost"
        },
        patent2026: {
          title: "Adaptive and Reconfigurable Dataflow Computing System and Method",
          body:
            "PCT publication WO2026/015086 A1, the third patent family from the founders’ NUS research. RiDM holds an exclusive license to the core IP."
        },
        patent2024: {
          title: "Hierarchical Network Design for Dynamic Dataflow Style Architectures",
          body: "PCT publication WO2024/242626 A1, the second patent family behind DODA."
        },
        grip: {
          title: "Graduated NUS GRIP",
          body:
            "Completed the National University of Singapore’s flagship deep-tech startup incubation programme, now National GRIP.",
          href: "https://www.nus.edu.sg/grip/wp-content/uploads/2023/02/GRIP-RUN-8-Team-Booklet.pdf",
          linkLabel: "GRIP Run 8 team booklet (PDF)"
        },
        patent2023: {
          title: "Reconfigurable Computing Architecture",
          body: "PCT publication WO2023/234867, the first patent family behind DODA."
        },
      }
    },
    about: {
      kicker: "ABOUT US",
      title: "Researchers building what they invented.",
      desc:
        "RiDM is an NUS spin-off founded by computer architecture researchers and a business lead from NUS. The founding team that did the underlying research remains directly involved in architecture, implementation and commercialization.",
      acronym: {
        kicker: "THE NAME",
        expansion: [
          ["R", "iDM"],
          ["i", "s"],
          ["", "a"],
          ["D", "ataflow"],
          ["M", "achine"]
        ],
        note:
          "A recursive acronym: the expansion contains the name itself. It is also the shortest description of the company — we research dataflow architecture, and we carry it into silicon."
      },
      teamKicker: "TEAM",
      teamTitle: "The people behind RiDM.",
      collapse: "Show less",
      expand: "Show more",
      websiteLabel: "Website",
      lead: {
        role: "CEO & Co-founder",
        name: "Jinho Lee, PhD",
        school: "NUS School of Computing",
        portrait: "/team/jinho-lee.jpg",
        links: [{ type: "linkedin", href: "https://www.linkedin.com/in/jinho-lee-phd-200a1212a" }],
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
          "RiDM began at the National University of Singapore, inside Dr. Trevor E. Carlson’s Computer Architecture Group. The founding team spent years there researching faster and more efficient computer architectures together, and the dynamic dataflow work that became DODA existed as published research and PCT filings long before it was a product.",
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
          body: "Secured seed funding from Qube Research & Technologies and The Invention Lab.",
          logos: [
            { src: "/investors/qrt.png", alt: "Qube Research & Technologies", height: 54 },
            { src: "/investors/the-invention-lab.png", alt: "The Invention Lab", height: 36 }
          ]
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
      ["01", "DODA Architecture", "Dynamically Orchestrated Dataflow"],
      ["02", "FPGA Overlay", "초기 검증 및 사업화 경로"],
      ["03", "Silicon Roadmap", "Architecture IP에서 전용 Silicon으로"]
    ],
    explore: {
      kicker: "EXPLORE",
      title: "더 깊이 살펴보기.",
      desc:
        "아키텍처, 응용 분야, 연구 기반, 팀 소개, 최신 소식은 각 페이지에서 자세히 확인할 수 있습니다.",
      more: "자세히 보기"
    },
    technology: {
      kicker: "01 / WHY NEAR-SENSOR",
      title: "데이터 이동은 줄이고, 반응은 더 빠르게.",
      desc:
        "센서가 많은 시스템에서는 모든 원시 데이터가 공유 메모리에 쌓이고, CPU가 전처리한 뒤 다시 메모리에 기록되며, 그제서야 가속기가 읽어갑니다. RiDM은 이 연산을 데이터가 생성되는 지점에서 먼저 수행합니다.",
      diagramNote: "개념적 데이터 경로",
      sensorsLabel: "SENSORS",
      conventional: {
        overline: "CONVENTIONAL FLOW",
        title: "모든 스트림이 동시에 도착하지만, CPU는 하나씩 처리합니다.",
        sensors: ["Camera", "Radar", "UWB", "Lidar"],
        memory: { name: "DRAM / 공유 메모리", note: "모든 원시 프레임이 먼저 이곳에 쌓입니다" },
        compute: [
          { name: "CPU", note: "필터링 · 인코딩/디코딩 · 리사이즈 · 포맷 변환" },
          { name: "GPU / NPU", note: "추론" }
        ],
        edges: { ingest: "모든 스트림 동시 유입", cpu: "하나씩 읽고 · 다시 쓰기", infer: "또 한 번 읽기" },
        costs: ["반응 지연 증가 — 결과 하나마다 메모리를 네 번 오갑니다", "프레임마다 달라지는 지연 — 각 스트림이 CPU 차례를 기다립니다", "센서를 추가할수록 모든 센서의 지연이 악화됩니다"]
      },
      ridm: {
        overline: "RiDM APPROACH",
        title: "모든 스트림이 동시에 도착하고, 처리도 동시에 이루어집니다.",
        sensors: ["Camera", "Radar", "UWB", "Lidar"],
        processor: {
          name: "Near-Sensor Processor",
          note: ["스트림마다 전용 모듈이 각자 다른 연산을 수행", "결과는 융합된 뒤 전달됩니다"],
          modules: ["리사이즈 · 크롭 · 슬라이스", "거리 측정 (장거리)", "실내 측위", "거리 측정 (근거리)"]
        },
        memory: { name: "DRAM / 공유 메모리", note: "축약된 고부가 데이터" },
        accel: { name: "GPU / NPU", note: "추론" },
        edges: { reduced: "융합 · 축약", infer: "한 번만 읽기" },
        costs: ["결과까지의 경로 단축 — 메모리에 도달하기 전에 데이터를 축약", "지연 편차 감소 — 어떤 스트림도 다른 스트림을 기다리지 않음", "센서가 늘어도 호스트 지연을 유지하도록 설계"]
      }
    },
    doda: {
      kicker: "02 / DODA ARCHITECTURE",
      title: "실행 중에 연산 흐름을 조율하는 데이터플로우 머신, DODA.",
      desc:
        "컴파일 시점에 정해진 순서가 아니라, 데이터가 준비된 연산부터 실행합니다. 새로운 워크로드를 위해 실리콘을 다시 만들지 않고 파이프라인을 재구성할 수 있습니다.",
      acronym: {
        kicker: "DODA STANDS FOR",
        expansion: [
          ["D", "ynamically"],
          ["O", "rchestrated"],
          ["D", "ataflow"],
          ["A", "rchitecture"]
        ],
        note:
          "오케스트레이션이 사전에 정해지지 않고 데이터가 도착하는 대로 이루어집니다. 고정된 파이프라인과 데이터플로우 머신의 차이가 바로 이 지점입니다."
      },
      lineageKicker: "LINEAGE",
      lineageTitle: "박사 연구에서 특허까지.",
      lineage: [
        {
          step: "RESEARCH",
          title: "Toward General-Purpose Dynamic Dataflow Processing",
          body: "빠르면서도 효율적인 범용 데이터플로우 아키텍처를 목표로 한 이진호 대표의 NUS 박사 연구입니다.",
          href: "https://scholarbank.nus.edu.sg/entities/publication/5a4c1379-bfae-40b1-a98a-e2ede9c855aa",
          linkLabel: "NUS ScholarBank"
        },
        {
          step: "FILED",
          title: "PCT 특허 3건",
          body: "핵심 아키텍처, 인터커넥트, 런타임 재구성을 포괄합니다.",
          href: null,
          linkLabel: null
        }
      ],
      simulator: {
        kicker: "TRY IT",
        title: "직접 실행해 보세요.",
        body:
          "doda_simulation은 Verilator로 구현한 DODA 시뮬레이터입니다. 간단한 컴파일러가 코드의 lambda 함수를 캡처해 DODA에서 실행하며, 데이터플로우 그래프를 그대로 실행하는 머신인 만큼 그래프를 직접 입력할 수도 있습니다. 예제 그래프도 함께 제공됩니다.",
        href: "https://github.com/gino-comp/doda_simulation",
        cta: "GitHub에서 doda_simulation 보기"
      }
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
    newsCopy: {
      kicker: "WHAT’S NEW",
      title: "새로운 소식과 연구 업데이트",
      desc:
        "회사 주요 이정표, 특허 공개, 창업팀의 연구 성과를 최신순으로 정리했습니다.",
      latest: "LATEST",
      link: "자세히 보기",
      items: {
        koreaTips: {
          title: "RiDM Korea 설립 및 TIPS 과제 선정",
          body:
            "실리콘 구현과 사업개발을 담당하는 자회사 RiDM Korea를 설립하고, TIPS R&D 과제에 선정되었습니다.",
          href: "https://www.linkedin.com/posts/jinho-lee-phd-200a1212a_big-news-for-ridm-we-are-incredibly-activity-7483049570373955584-wvhT",
          linkLabel: "LinkedIn 발표 보기"
        },
        seedRound: {
          title: "시드 투자 유치",
          body:
            "Qube Research & Technologies와 The Invention Lab으로부터 시드 투자를 유치하여 연구 단계의 아키텍처를 실리콘으로 이어가고 있습니다.",
          href: "https://m.thebell.co.kr/m/newsview.asp?newskey=202606221313048600106435",
          linkLabel: "더벨 기사 보기"
        },
        patent2026: {
          title: "Adaptive and Reconfigurable Dataflow Computing System and Method",
          body:
            "공동창업자들의 NUS 연구에서 시작된 세 번째 특허 패밀리로, PCT 공개번호는 WO2026/015086 A1입니다. RiDM은 핵심 IP에 대한 독점 라이선스를 보유하고 있습니다."
        },
        patent2024: {
          title: "Hierarchical Network Design for Dynamic Dataflow Style Architectures",
          body: "DODA를 뒷받침하는 두 번째 특허 패밀리로, PCT 공개번호는 WO2024/242626 A1입니다."
        },
        grip: {
          title: "NUS GRIP 수료",
          body:
            "싱가포르국립대학교(NUS)의 대표 딥테크 창업 인큐베이팅 프로그램 GRIP(현 National GRIP)을 수료했습니다.",
          href: "https://www.nus.edu.sg/grip/wp-content/uploads/2023/02/GRIP-RUN-8-Team-Booklet.pdf",
          linkLabel: "GRIP Run 8 팀 부클릿 (PDF)"
        },
        patent2023: {
          title: "Reconfigurable Computing Architecture",
          body: "DODA를 뒷받침하는 첫 번째 특허 패밀리로, PCT 공개번호는 WO2023/234867입니다."
        },
      }
    },
    about: {
      kicker: "ABOUT US",
      title: "핵심 기술을 연구한 팀이 직접 만듭니다.",
      desc:
        "RiDM은 NUS 컴퓨터 아키텍처 연구진과 NUS MBA 출신 CFO가 함께 설립한 NUS Spin-off입니다. 핵심 기술을 직접 연구한 공동창업자들이 아키텍처 구현과 사업화까지 이어가고 있습니다.",
      acronym: {
        kicker: "THE NAME",
        expansion: [
          ["R", "iDM"],
          ["i", "s"],
          ["", "a"],
          ["D", "ataflow"],
          ["M", "achine"]
        ],
        note:
          "이름 안에 이름이 다시 등장하는 재귀 약어(recursive acronym)입니다. 동시에 회사를 가장 짧게 설명하는 문장이기도 합니다. 데이터플로우 아키텍처를 직접 연구하고, 실리콘으로 구현합니다."
      },
      teamKicker: "TEAM",
      teamTitle: "RiDM을 만드는 사람들.",
      collapse: "간략히",
      expand: "자세히",
      websiteLabel: "웹사이트",
      lead: {
        role: "CEO & Co-founder",
        name: "이진호, PhD",
        school: "NUS School of Computing",
        portrait: "/team/jinho-lee.jpg",
        links: [{ type: "linkedin", href: "https://www.linkedin.com/in/jinho-lee-phd-200a1212a" }],
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
          body: "Qube Research & Technologies와 The Invention Lab으로부터 시드 라운드 투자를 유치했습니다.",
          logos: [
            { src: "/investors/qrt.png", alt: "Qube Research & Technologies", height: 54 },
            { src: "/investors/the-invention-lab.png", alt: "The Invention Lab", height: 36 }
          ]
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

export type MilestoneLogo = { src: string; alt: string; height: number };

export type Milestone = {
  year: string;
  title: string;
  body: string;
  logos?: readonly MilestoneLogo[];
};

// One announcement: the locale-independent half, matched to its prose by `key`.
export type NewsEntry = {
  key: string;
  // Partial ISO date: "2021", "2023-09" or "2023-09-26".
  date: string;
  category: string;
};

// The outbound link lives here rather than on the entry, because coverage of
// the same milestone differs by language: the seed round points at a Korean
// outlet in ko and an English one in en.
export type NewsCopy = { title: string; body: string; href?: string; linkLabel?: string };

// [highlighted initial, rest of the word]; the initials spell RiDM.
export type AcronymPart = readonly [string, string];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
