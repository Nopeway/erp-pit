// ============= NAVIGATION =============
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.section;
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    navButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.section === target);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ============= MILESTONE EXPAND/COLLAPSE =============
document.querySelectorAll('[data-expand]').forEach(m => {
  m.addEventListener('click', () => {
    m.classList.toggle('expanded');
  });
});
// Auto-expand M1
const firstMilestone = document.querySelector('[data-expand]');
if (firstMilestone) firstMilestone.classList.add('expanded');

// ============= BUDGET CALCULATOR =============
const scenarios = {
  proposed: {
    layer1: 134000000,
    layer2: 65500000,
    contingency: 20000000,
    chart: [10.5, 10.8, 10.8, 25.4, 26.0, 26.0, 24.5, 22.5, 21.5, 21.5]
  },
  expected: {
    layer1: 131100000,
    layer2: 57600000,
    contingency: 0,
    chart: [9.2, 9.5, 9.5, 24.4, 25.0, 25.0, 23.5, 21.5, 20.55, 20.55]
  }
};

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');
const fmtJt = (n) => (n/1000000).toFixed(1).replace('.0','') + ' Jt';

const layer1Sub = {
  proposed: 'Infrastructure & PL Compensation · rata-rata Rp 13,4 Jt/bln',
  expected: 'Infrastructure & PL Compensation · rata-rata Rp 13,1 Jt/bln'
};

function updateScenario(scen) {
  const s = scenarios[scen];
  document.getElementById('calcLayer1').textContent = fmt(s.layer1);
  document.getElementById('calcLayer1Sub').textContent = layer1Sub[scen];
  document.getElementById('calcLayer2').textContent = fmt(s.layer2);
  const subtotal = s.layer1 + s.layer2;
  const total = subtotal + s.contingency;
  document.getElementById('calcSubtotal').textContent = fmtJt(subtotal);
  document.getElementById('calcContingency').textContent = fmtJt(s.contingency);
  document.getElementById('calcTotal').textContent = fmtJt(total);
}

document.querySelectorAll('#scenarioToggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#scenarioToggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateScenario(btn.dataset.scenario);
    renderChart(btn.dataset.scenario);
  });
});

// ============= CHART =============
function getPhase(idx) {
  if (idx < 3) return 'primary';
  if (idx < 7) return 'amber';
  return 'violet';
}

function renderChart(scen) {
  const data = scenarios[scen].chart;
  const maxVal = 30;
  const container = document.getElementById('budgetBars');
  container.innerHTML = '';
  data.forEach((v, i) => {
    const pct = (v / maxVal) * 100;
    const phase = getPhase(i);
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <div class="bar-wrap">
        <div class="bar ${phase}" style="height: 0%">
          <div class="bar-tooltip">Rp ${v} Jt</div>
        </div>
      </div>
      <div class="bar-label">M${i+1}</div>
    `;
    container.appendChild(col);
    setTimeout(() => {
      col.querySelector('.bar').style.height = pct + '%';
    }, 80 + i * 50);
  });
  document.getElementById('chartScenarioLabel').textContent =
    (scen === 'proposed' ? 'Budget Maksimum' : 'Target Eksekusi') + ' · Rp Juta per bulan';
}

renderChart('proposed');
