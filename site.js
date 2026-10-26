const PLAN={"name": "TechWater", "responses": ["Start with billing dates, units and recent changes at the property. An unexplained difference needs investigation before a cause can be assigned.", "Confirm each record covers comparable dates and known meter boundaries. Keep missing data visible rather than estimating silently.", "Begin with a reliable baseline and a property owner who can investigate findings. Prioritize checks before buying equipment.", "Describe the records or professional expertise you can contribute and the practical reporting question you want to test."]};

const menu=document.querySelector('.menu');
const links=document.querySelector('.links');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.textContent=open?'Menu':'Close';links.dataset.open=String(!open)});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.dataset.open='false';menu.setAttribute('aria-expanded','false');menu.textContent='Menu'}));
const select=document.getElementById('focus');
const hint=document.getElementById('planning-hint');
select.addEventListener('change',()=>{hint.textContent=PLAN.responses[select.selectedIndex];document.getElementById('brief-result').hidden=true;document.getElementById('copy-status').textContent=''});
document.getElementById('brief-form').addEventListener('submit',e=>{e.preventDefault();const note=document.getElementById('context').value.trim();const brief=PLAN.name+' — expression of interest\n\nFocus: '+select.value+'\nContext: '+(note||'To discuss')+'\n\nPlanning starting point: '+PLAN.responses[select.selectedIndex]+'\n\nI understand this is an early-stage concept. Please let me know whether a suitable pilot is available.';document.getElementById('brief-text').value=brief;document.getElementById('email-brief').href='mailto:josephjilovec@pm.me?subject='+encodeURIComponent(PLAN.name+' — planning inquiry')+'&body='+encodeURIComponent(brief);document.getElementById('brief-result').hidden=false;document.getElementById('brief-heading').focus();document.getElementById('copy-status').textContent='Brief prepared. Review it below; nothing has been sent.'});
document.getElementById('copy-brief').addEventListener('click',async()=>{const area=document.getElementById('brief-text');try{await navigator.clipboard.writeText(area.value);document.getElementById('copy-status').textContent='Copied. You can paste this into your preferred email app.'}catch{area.focus();area.select();document.getElementById('copy-status').textContent='Select and copy the brief above using your device’s copy command.'}});

document.getElementById('brief-text').addEventListener('input',e=>{document.getElementById('email-brief').href='mailto:josephjilovec@pm.me?subject='+encodeURIComponent(PLAN.name+' — planning inquiry')+'&body='+encodeURIComponent(e.target.value)});

const comparisonButtons = document.querySelectorAll('[data-comparison]');
comparisonButtons.forEach(button => button.addEventListener('click', () => {
  const daily = button.dataset.comparison === 'daily';
  comparisonButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.getElementById('period-a-bar').style.width = daily ? '80%' : '68.5714%';
  document.getElementById('period-b-bar').style.width = '90%';
  document.getElementById('period-a-value').textContent = daily ? '800 US gal/day' : '24,000 US gal';
  document.getElementById('period-b-value').textContent = daily ? '900 US gal/day' : '31,500 US gal';
  const summary = document.getElementById('comparison-summary');
  summary.replaceChildren();
  const lead = document.createElement('strong');
  lead.textContent = daily ? '12.5% higher daily use.' : '31.3% higher billed total.';
  summary.append(lead, document.createTextNode(daily ? ' The billing period was also five days longer.' : ' Compare per day to account for the different billing durations.'));
}));
