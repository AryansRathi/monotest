import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Name used for axe-core result attachments.
 * Tests must attach their results with this exact name for the reporter to pick them up.
 */
export const A11Y_ATTACHMENT_NAME = 'accessibility-scan-results';

interface AxeNode {
    html: string;
    target: string[];
    failureSummary?: string;
}

interface AxeRule {
    id: string;
    impact?: string;
    description: string;
    help: string;
    helpUrl: string;
    tags: string[];
    nodes: AxeNode[];
}

interface PageResult {
    testPath: string;
    url: string;
    timestamp: string;
    violations: AxeRule[];
    passes: AxeRule[];
    incomplete: AxeRule[];
    inapplicable: AxeRule[];
}

interface ReporterOptions {
    outputDir?: string;
    reportFileName?: string;
    projectKey?: string;
}

/**
 * Custom Playwright reporter that collects axe-core accessibility scan results
 * from test attachments and generates a single combined HTML report.
 *
 * Tests should attach their axe results using:
 * ```ts
 * await testInfo.attach('accessibility-scan-results', {
 *     body: JSON.stringify(axeResults, null, 2),
 *     contentType: 'application/json'
 * });
 * ```
 *
 * Add to `playwright.config.ts`:
 * ```ts
 * reporter: [
 *     ['./reporters/a11y-reporter.ts', { projectKey: 'My Project' }]
 * ]
 * ```
 */
class A11yReporter implements Reporter {
    private results: PageResult[] = [];
    private readonly outputDir: string;
    private readonly reportFileName: string;
    private readonly projectKey: string;

    constructor(options: ReporterOptions = {}) {
        this.outputDir = options.outputDir ?? './test-results/accessibility-report';
        this.reportFileName = options.reportFileName ?? 'a11y-report.html';
        this.projectKey = options.projectKey ?? 'Accessibility Report';
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const attachment = result.attachments.find((a) => a.name === A11Y_ATTACHMENT_NAME);
        if (!attachment?.body) return;

        try {
            const axeResults = JSON.parse(attachment.body.toString());
            this.results.push({
                testPath: test.titlePath().slice(2).join(' › '),
                url: axeResults.url ?? 'Unknown',
                timestamp: axeResults.timestamp ?? new Date().toISOString(),
                violations: axeResults.violations ?? [],
                passes: axeResults.passes ?? [],
                incomplete: axeResults.incomplete ?? [],
                inapplicable: axeResults.inapplicable ?? []
            });
        } catch {
            // Ignore malformed attachments
        }
    }

    async onEnd(_result: FullResult): Promise<void> {
        if (this.results.length === 0) return;

        this.results.sort((a, b) => a.testPath.localeCompare(b.testPath));

        const html = this.generateReport();

        fs.mkdirSync(this.outputDir, { recursive: true });
        const reportPath = path.join(this.outputDir, this.reportFileName);
        fs.writeFileSync(reportPath, html, 'utf-8');

        console.log(`\n  Accessibility report: ${path.resolve(reportPath)}\n`);
    }

    // ---------------------------------------------------------------------------
    // Report generation
    // ---------------------------------------------------------------------------

    private generateReport(): string {
        const totalViolations = this.results.reduce((s, r) => s + r.violations.length, 0);
        const totalPasses = this.results.reduce((s, r) => s + r.passes.length, 0);
        const totalIncomplete = this.results.reduce((s, r) => s + r.incomplete.length, 0);
        const totalInapplicable = this.results.reduce((s, r) => s + r.inapplicable.length, 0);
        const timestamp = new Date().toLocaleString();

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.esc(this.projectKey)}</title>
  <style>${STYLES}</style>
</head>
<body>
  <header>
    <h1>${this.esc(this.projectKey)}</h1>
    <p class="meta">Generated on ${this.esc(timestamp)} · ${this.results.length} page(s) scanned</p>
  </header>

  <section class="summary">
    <div class="card ${totalViolations > 0 ? 'violations' : 'ok'}">
      <span class="value">${totalViolations}</span>
      <span class="label">Violations</span>
    </div>
    <div class="card passes">
      <span class="value">${totalPasses}</span>
      <span class="label">Passes</span>
    </div>
    <div class="card incomplete">
      <span class="value">${totalIncomplete}</span>
      <span class="label">Incomplete</span>
    </div>
    <div class="card inapplicable">
      <span class="value">${totalInapplicable}</span>
      <span class="label">Inapplicable</span>
    </div>
  </section>

  ${this.results.map((r) => this.renderPage(r)).join('\n')}

  <script>${SCRIPT}</script>
</body>
</html>`;
    }

    private renderPage(result: PageResult): string {
        const hasViolations = result.violations.length > 0;
        const statusClass = hasViolations ? 'fail' : 'pass';
        const statusIcon = hasViolations ? '✗' : '✓';

        return `
  <section class="page-result">
    <button class="page-header" aria-expanded="true" onclick="toggle(this)">
      <span class="status-icon ${statusClass}">${statusIcon}</span>
      <div class="page-info">
        <h2>${this.esc(result.testPath)}</h2>
        <span class="url">${this.esc(result.url)}</span>
      </div>
      <div class="page-stats">
        <span class="badge violations">${result.violations.length} violations</span>
        <span class="badge passes">${result.passes.length} passes</span>
        <span class="badge incomplete">${result.incomplete.length} incomplete</span>
      </div>
      <span class="chevron">▼</span>
    </button>
    <div class="page-body">
      ${this.renderRuleList('Violations', result.violations, 'violations')}
      ${this.renderRuleList('Incomplete', result.incomplete, 'incomplete')}
      ${this.renderRuleList('Passes', result.passes, 'passes')}
      ${this.renderRuleList('Inapplicable', result.inapplicable, 'inapplicable')}
    </div>
  </section>`;
    }

    private renderRuleList(title: string, rules: AxeRule[], type: string): string {
        if (rules.length === 0) return '';

        return `
      <div class="rule-section">
        <h3 class="${type}">${title} (${rules.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Impact</th>
              <th>Rule</th>
              <th>Description</th>
              <th>Elements</th>
            </tr>
          </thead>
          <tbody>
            ${rules.map((rule) => this.renderRule(rule)).join('\n')}
          </tbody>
        </table>
      </div>`;
    }

    private renderRule(rule: AxeRule): string {
        const impact = rule.impact ?? 'n/a';

        return `
            <tr>
              <td><span class="impact impact-${impact}">${impact}</span></td>
              <td><a href="${this.esc(rule.helpUrl)}" target="_blank" rel="noopener">${this.esc(rule.id)}</a></td>
              <td>${this.esc(rule.help)}</td>
              <td>
                ${rule.nodes
                    .map(
                        (node) => `
                  <details>
                    <summary><code>${this.esc(this.truncate(node.target.join(', '), 80))}</code></summary>
                    <pre>${this.esc(node.html)}</pre>
                    ${node.failureSummary ? `<p class="failure-summary">${this.esc(node.failureSummary)}</p>` : ''}
                  </details>`
                    )
                    .join('\n')}
              </td>
            </tr>`;
    }

    // ---------------------------------------------------------------------------
    // Utility
    // ---------------------------------------------------------------------------

    private esc(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    private truncate(str: string, max: number): string {
        return str.length > max ? str.slice(0, max) + '…' : str;
    }
}

// ---------------------------------------------------------------------------
// Inline CSS – self-contained report with no external dependencies
// ---------------------------------------------------------------------------

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8f9fa;
    color: #212529;
    line-height: 1.6;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  header { margin-bottom: 2rem; }
  header h1 { font-size: 1.75rem; font-weight: 600; }

  .meta {
    color: #6c757d;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  /* Summary cards */
  .summary { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }

  .card {
    background: white;
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    min-width: 140px;
    border-top: 3px solid #dee2e6;
  }
  .card.violations { border-top-color: #dc3545; }
  .card.ok { border-top-color: #28a745; }
  .card.passes { border-top-color: #28a745; }
  .card.incomplete { border-top-color: #ffc107; }
  .card.inapplicable { border-top-color: #6c757d; }

  .value { font-size: 2rem; font-weight: 700; line-height: 1; }
  .card.violations .value { color: #dc3545; }
  .card.ok .value { color: #28a745; }
  .card.passes .value { color: #28a745; }
  .card.incomplete .value { color: #ffc107; }
  .card.inapplicable .value { color: #6c757d; }

  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6c757d;
    margin-top: 0.25rem;
  }

  /* Page result sections */
  .page-result {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .page-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font: inherit;
    color: inherit;
  }
  .page-header:hover { background: #f8f9fa; }

  .status-icon {
    font-size: 1.25rem;
    font-weight: 700;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .status-icon.pass { background: #d4edda; color: #155724; }
  .status-icon.fail { background: #f8d7da; color: #721c24; }

  .page-info { flex: 1; min-width: 0; }
  .page-info h2 { font-size: 1rem; font-weight: 600; }

  .url {
    font-size: 0.75rem;
    color: #6c757d;
    word-break: break-all;
  }

  .page-stats { display: flex; gap: 0.5rem; flex-shrink: 0; }

  .badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    white-space: nowrap;
  }
  .badge.violations { background: #f8d7da; color: #721c24; }
  .badge.passes { background: #d4edda; color: #155724; }
  .badge.incomplete { background: #fff3cd; color: #856404; }

  .chevron {
    font-size: 0.75rem;
    color: #6c757d;
    transition: transform 0.2s;
    flex-shrink: 0;
  }
  .page-header[aria-expanded="false"] .chevron { transform: rotate(-90deg); }

  .page-body { padding: 0 1.25rem 1.25rem; }
  .page-body.collapsed { display: none; }

  /* Rule tables */
  .rule-section { margin-top: 1rem; }

  .rule-section h3 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    padding-bottom: 0.25rem;
    border-bottom: 2px solid #dee2e6;
  }
  h3.violations { color: #dc3545; border-color: #dc3545; }
  h3.incomplete { color: #e67700; border-color: #ffc107; }
  h3.passes { color: #28a745; border-color: #28a745; }
  h3.inapplicable { color: #6c757d; border-color: #6c757d; }

  table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }

  th, td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
    vertical-align: top;
  }
  th {
    font-weight: 600;
    color: #495057;
    background: #f8f9fa;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .impact {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
  }
  .impact-critical { background: #f8d7da; color: #721c24; }
  .impact-serious { background: #ffe0cc; color: #7a3300; }
  .impact-moderate { background: #fff3cd; color: #856404; }
  .impact-minor { background: #cce5ff; color: #004085; }

  a { color: #0d6efd; text-decoration: none; }
  a:hover { text-decoration: underline; }

  details { margin: 0.25rem 0; }
  summary { cursor: pointer; font-size: 0.75rem; }
  summary code {
    background: #f1f3f5;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
  }

  pre {
    background: #f1f3f5;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    overflow-x: auto;
    margin-top: 0.25rem;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .failure-summary {
    font-size: 0.75rem;
    color: #dc3545;
    margin-top: 0.25rem;
  }
`;

// ---------------------------------------------------------------------------
// Inline JavaScript – collapse/expand page sections
// ---------------------------------------------------------------------------

const SCRIPT = `
  function toggle(button) {
    var expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    button.nextElementSibling.classList.toggle('collapsed');
  }
`;

export default A11yReporter;
