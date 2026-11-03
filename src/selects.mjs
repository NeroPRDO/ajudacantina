// Accessible disclosure menus: native select remains the data model; all visible
// options are ordinary buttons, operable with Tab, Enter, Space and Escape.
export function enhanceSelects(root=document) {
  for(const select of root.querySelectorAll('select')) {
    let widget=select.nextElementSibling;
    if(!widget?.matches('.choice')) {
      widget=document.createElement('details');widget.className='choice';
      const summary=document.createElement('summary');
      const options=document.createElement('div');options.className='choice-options';
      widget.append(summary,options);select.after(widget);select.hidden=true;
      summary.addEventListener('click',()=>document.querySelectorAll('.choice[open]').forEach(other=>{if(other!==widget)other.open=false;}));
      options.addEventListener('click',event=>{
        const button=event.target.closest('button[data-value]');if(!button)return;
        const id=select.id;select.value=button.dataset.value;widget.open=false;
        select.dispatchEvent(new Event('change',{bubbles:true}));enhanceSelects();
        document.getElementById(id)?.nextElementSibling?.querySelector('summary')?.focus();
      });
      widget.addEventListener('keydown',event=>{
        if(event.key==='Escape'&&widget.open){event.preventDefault();widget.open=false;summary.focus();event.stopPropagation();}
        if(event.key==='ArrowDown'||event.key==='ArrowUp'){
          event.preventDefault();widget.open=true;
          const buttons=[...options.querySelectorAll('button')];
          const index=buttons.indexOf(document.activeElement);
          const next=index<0?(event.key==='ArrowDown'?0:buttons.length-1):(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
          buttons[next]?.focus();
        }
      });
    }
    const labelNode=select.labels?.[0]?.cloneNode(true);
    labelNode?.querySelectorAll('select,.choice').forEach(node=>node.remove());
    const label=labelNode?.textContent.trim()||select.getAttribute('aria-label')||select.id;
    const summary=widget.querySelector('summary');
    const selected=select.selectedOptions[0];
    const text=selected?.dataset.short||selected?.textContent||'';
    if(summary.textContent!==text)summary.textContent=text;
    summary.setAttribute('aria-label',label+': '+(selected?.textContent||text));
    const signature=[...select.options].map(o=>o.value+'|'+o.textContent+'|'+o.selected).join('\n');
    if(widget.dataset.signature!==signature){
      widget.dataset.signature=signature;
      widget.querySelector('.choice-options').replaceChildren(...[...select.options].map(option=>{
        const button=document.createElement('button');button.type='button';button.dataset.value=option.value;button.textContent=option.textContent;if(option.lang)button.lang=option.lang;button.disabled=option.disabled;button.setAttribute('aria-pressed',String(option.selected));return button;
      }));
    }
  }
}
export function watchSelects(){
  enhanceSelects();new MutationObserver(()=>enhanceSelects()).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',event=>document.querySelectorAll('.choice[open]').forEach(widget=>{if(!widget.contains(event.target))widget.open=false;}));
}
