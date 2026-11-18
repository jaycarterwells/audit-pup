// Turns the counselor guide (docs/chromebook-guide.md) into the HTML of the Guide window inside the page, so the
// guide counselors read is always the one for the version they use. build_html.js puts it in at __GUIDE_HTML__.
// The guide uses: headings, paragraphs, bullet lists with one nested level, numbered lists, tables, bold, and bare links.
// The guide's own title (the # heading) is left out: the window has its own title.
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>')
  .replace(/(https?:\/\/[^\s)<]+[^\s).,<])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
function guideHtml(md){
  const lines=md.replace(/\r/g,'').split('\n'), out=[]; let i=0;
  const cells=r=>r.replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
  while(i<lines.length){ const l=lines[i]; let m;
    if(!l.trim()){ i++; continue; }
    if((m=l.match(/^(#{1,3}) (.*)$/))){ if(m[1].length>1) out.push(`<h${m[1].length+1}>${inline(m[2])}</h${m[1].length+1}>`); i++; continue; }
    if(/^\|/.test(l)){ const rows=[]; while(i<lines.length && /^\|/.test(lines[i])){ rows.push(lines[i]); i++; }
      out.push('<table><thead><tr>'+cells(rows[0]).map(c=>`<th scope="col">${inline(c)}</th>`).join('')+'</tr></thead><tbody>'+
        rows.slice(2).map(r=>'<tr>'+cells(r).map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('')+'</tbody></table>'); continue; }
    if(/^\* /.test(l)){ const items=[]; while(i<lines.length && /^(\* | {2}\* )/.test(lines[i])){
        if(/^\* /.test(lines[i])) items.push({text:lines[i].slice(2), sub:[]}); else items[items.length-1].sub.push(lines[i].trim().slice(2)); i++; }
      out.push('<ul>'+items.map(it=>`<li>${inline(it.text)}${it.sub.length?'<ul>'+it.sub.map(x=>`<li>${inline(x)}</li>`).join('')+'</ul>':''}</li>`).join('')+'</ul>'); continue; }
    if(/^\d+\. /.test(l)){ const items=[]; while(i<lines.length && /^\d+\. /.test(lines[i])){ items.push(lines[i].replace(/^\d+\. /,'')); i++; }
      out.push('<ol>'+items.map(x=>`<li>${inline(x)}</li>`).join('')+'</ol>'); continue; }
    const para=[]; while(i<lines.length && lines[i].trim() && !/^(#|\||\* |\d+\. )/.test(lines[i])){ para.push(lines[i].trim()); i++; }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}
module.exports={ guideHtml };
