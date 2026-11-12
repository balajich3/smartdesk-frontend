const CATEGORY_RULES = [
  {
    department: 'HR',
    category: [
      { name: 'Payroll', pattern: /payroll|salary|paycheck|payslip|tax withholding/i },
      { name: 'Benefits', pattern: /benefit|insurance|401k|retirement/i },
      { name: 'Leave and time off', pattern: /leave|vacation|pto|time off|absence/i },
      { name: 'Onboarding', pattern: /onboard|new hire|employment paperwork/i },
    ],
    pattern: /payroll|salary|paycheck|payslip|tax withholding|benefit|insurance|401k|retirement|leave|vacation|pto|time off|absence|onboard|new hire|human resources|\bhr\b/i,
    fallbackCategory: 'HR support',
  },
  {
    department: 'Facilities',
    category: [
      { name: 'Office equipment', pattern: /printer|chair|\bdesk\b|monitor arm|projector|copier|keycard|badge/i },
      { name: 'Building maintenance', pattern: /light|plumb|heating|cooling|air condition|\bac\b|leak|repair|maintenance/i },
      { name: 'Cleaning and environment', pattern: /clean|temperature|noise|pest|waste/i },
    ],
    pattern: /printer|chair|\bdesk\b|projector|copier|keycard|badge|building|room|light|plumb|heating|cooling|air condition|\bac\b|leak|repair|maintenance|clean|temperature|pest|facilit/i,
    fallbackCategory: 'Facilities support',
  },
  {
    department: 'Java',
    category: [
      { name: 'Java application', pattern: /java|jvm|spring boot|maven|gradle/i },
    ],
    pattern: /java|jvm|spring boot|maven|gradle/i,
    fallbackCategory: 'Java application',
  },
  {
    department: 'Dotnet',
    category: [
      { name: '.NET application', pattern: /\.net|dotnet|c#|asp\.net|nuget|iis/i },
    ],
    pattern: /\.net|dotnet|c#|asp\.net|nuget|iis/i,
    fallbackCategory: '.NET application',
  },
  {
    department: 'AI',
    category: [
      { name: 'AI and machine learning', pattern: /\bai\b|machine learning|model|inference|llm|prompt/i },
    ],
    pattern: /\bai\b|machine learning|model|inference|llm|prompt/i,
    fallbackCategory: 'AI and machine learning',
  },
]

function createSummary(description) {
  const sentence = description.trim().replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/)[0]
  if (sentence.length <= 180) return sentence
  return `${sentence.slice(0, 177).trimEnd()}...`
}

export function classifyTicket({ title = '', description = '' }) {
  const text = `${title} ${description}`
  const departmentRule = CATEGORY_RULES.find((rule) => rule.pattern.test(text))
  const department = departmentRule?.department || 'IT'
  const category = departmentRule?.category.find((item) => item.pattern.test(text))?.name
    || departmentRule?.fallbackCategory
    || (/vpn|wifi|internet|network/i.test(text)
      ? 'Network'
      : /laptop|computer|battery|device|hardware/i.test(text)
        ? 'Hardware'
        : /password|sign in|login|access|account/i.test(text)
          ? 'Access'
          : /email|mail|signature/i.test(text)
            ? 'Email'
            : /software|application|app|portal/i.test(text)
              ? 'Software'
              : 'IT support')
  const priority = /low|minor|when possible/i.test(text)
    ? 'Low'
    : /urgent|asap|critical|outage|security breach|unable to work|can't work|cannot work|cannot deploy|deployment failure|build failed|blocked|everyone|multiple people|not working/i.test(text)
      ? 'High'
      : 'Medium'

  return {
    department,
    category,
    summary: createSummary(description),
    priority,
  }
}
