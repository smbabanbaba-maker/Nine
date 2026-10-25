'use strict';
(function(){
  const header=document.getElementById('site-header');
  const menuButton=document.getElementById('menu-toggle');
  const mobileNav=document.getElementById('mobile-nav');
  const mobileLinks=mobileNav?Array.from(mobileNav.querySelectorAll('a')):[];
  const navLinks=Array.from(document.querySelectorAll('.desktop-nav a'));
  const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toggleMenu(open){
    if(!menuButton||!mobileNav)return;
    mobileNav.hidden=!open;
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    document.body.classList.toggle('menu-open',open);
  }
  if(menuButton){
    menuButton.addEventListener('click',function(){toggleMenu(menuButton.getAttribute('aria-expanded')!=='true')});
    mobileLinks.forEach(function(link){link.addEventListener('click',function(){toggleMenu(false)})});
    window.addEventListener('keydown',function(e){if(e.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){toggleMenu(false);menuButton.focus()}});
    document.addEventListener('click',function(e){if(!header.contains(e.target)&&menuButton.getAttribute('aria-expanded')==='true')toggleMenu(false)});
    window.addEventListener('resize',function(){if(window.innerWidth>1000)toggleMenu(false)});
  }

  function updateHeader(){
    if(header)header.classList.toggle('is-scrolled',window.scrollY>12);
  }
  updateHeader();
  window.addEventListener('scroll',updateHeader,{passive:true});

  // Page-level navigation: every section has its own document.
  const currentPage=document.body.dataset.page||'home';
  const pageFiles={home:'index.html',about:'about.html',services:'services.html',programmes:'programmes.html',projects:'projects.html',impact:'impact.html',partners:'partners.html',faq:'faq.html',contact:'contact.html'};
  const currentFile=pageFiles[currentPage]||'index.html';
  navLinks.forEach(function(link){
    const active=link.getAttribute('href')===currentFile;
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  const partnerNavLink=document.querySelector('.nav-cta');
  if(partnerNavLink&&currentPage==='partners')partnerNavLink.setAttribute('aria-current','page');

  // Preserve previously shared one-page links by routing them to their new pages.
  if(currentPage==='home'&&window.location.hash){
    const target=decodeURIComponent(window.location.hash.substring(1));
    if(pageFiles[target]&&target!=='home'){
      window.location.replace(pageFiles[target]);
      return;
    }
    if(target==='mission'){window.location.replace('about.html#mission');return}
  }

  // Reveal visible elements without disrupting page navigation.
  const reveals=document.querySelectorAll('[data-reveal]');
  if(!('IntersectionObserver' in window)||reducedMotion){
    reveals.forEach(function(el){el.classList.add('is-visible')});
  }else{
    const revealObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },{rootMargin:'0px 0px -35px 0px',threshold:.06});
    reveals.forEach(function(el){revealObserver.observe(el)});
  }

  const chips=Array.from(document.querySelectorAll('[data-filter]'));
  const cards=Array.from(document.querySelectorAll('[data-category]'));
  chips.forEach(function(chip){
    chip.addEventListener('click',function(){
      const value=chip.dataset.filter;
      chips.forEach(function(item){const on=item===chip;item.classList.toggle('selected',on);item.setAttribute('aria-pressed',String(on))});
      cards.forEach(function(card){card.hidden=value!=='all'&&card.dataset.category!==value});
    });
  });

  const form=document.getElementById('contact-form');
  const copyButton=document.getElementById('copy-enquiry');
  const status=document.getElementById('form-status');
  if(form){
    const fields=Array.from(form.querySelectorAll('input,select,textarea'));
    function setStatus(message,isError){
      if(!status)return;
      status.textContent=message;
      status.style.color=isError?'#a13e35':'#246f44';
    }
    function validate(){
      let firstInvalid=null;
      fields.forEach(function(field){
        const valid=field.checkValidity();
        field.classList.toggle('invalid',!valid);
        field.setAttribute('aria-invalid',String(!valid));
        if(!valid&&!firstInvalid)firstInvalid=field;
      });
      if(firstInvalid){setStatus('Please complete all required fields with valid details.',true);firstInvalid.focus();return false}
      return true;
    }
    fields.forEach(function(field){field.addEventListener('input',function(){field.classList.remove('invalid');field.removeAttribute('aria-invalid')})});
    function buildEnquiry(){
      const data=new FormData(form);
      return 'NatureWorks partnership / enquiry\n\n'+
        'Full name: '+String(data.get('name')||'').trim()+'\n'+
        'Email: '+String(data.get('email')||'').trim()+'\n'+
        'Area of interest: '+String(data.get('interest')||'').trim()+'\n\n'+
        'Message:\n'+String(data.get('message')||'').trim()+'\n\n'+
        '---\nPrepared using the NatureWorks Global Solutions website.';
    }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!validate())return;
      const area=String(new FormData(form).get('interest')||'General enquiry');
      const subject=encodeURIComponent('NatureWorks enquiry — '+area);
      const body=encodeURIComponent(buildEnquiry());
      setStatus('Your email draft is ready. Add the official NatureWorks email address before sending.',false);
      window.location.href='mailto:?subject='+subject+'&body='+body;
    });
    if(copyButton)copyButton.addEventListener('click',async function(){
      if(!validate())return;
      const value=buildEnquiry();
      try{
        if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value)}
        else{
          const temporary=document.createElement('textarea');
          temporary.value=value;
          temporary.style.position='fixed';temporary.style.opacity='0';
          document.body.appendChild(temporary);
          temporary.focus();temporary.select();
          const succeeded=document.execCommand('copy');
          temporary.remove();
          if(!succeeded)throw new Error('Copy unavailable');
        }
        setStatus('Enquiry copied. Paste it into your preferred messaging or email app.',false);
      }catch(err){setStatus('Could not copy automatically. Try the email draft button instead.',true)}
    });
  }

  // Nine NatureWorks photo stories: automatic crossfade every three seconds.
  // Hero text and CTAs are independent from these background-only layers.
  const heroSlideshow = document.getElementById('hero-slideshow');
  if(heroSlideshow){
    const heroSlides = Array.from(heroSlideshow.querySelectorAll('.hero-slide'));
    const slideIntervalMs = 3000;
    let currentHeroIndex=0;
    let heroTimer=null;
    const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
    let manuallyPaused=motionPreference.matches;
    const heroPauseButton=document.getElementById('hero-motion-toggle');
    const heroPauseLabel=heroPauseButton?heroPauseButton.querySelector('.hero-motion-label'):null;
    function showNextHeroSlide(){
      if(heroSlides.length<2)return;
      heroSlides[currentHeroIndex].classList.remove('is-active');
      currentHeroIndex=(currentHeroIndex+1)%heroSlides.length;
      heroSlides[currentHeroIndex].classList.add('is-active');
    }
    function stopHeroTimer(){
      if(heroTimer!==null){window.clearInterval(heroTimer);heroTimer=null}
    }
    function syncHeroTimer(){
      stopHeroTimer();
      if(!document.hidden&&!manuallyPaused&&heroSlides.length>1){
        heroTimer=window.setInterval(showNextHeroSlide,slideIntervalMs);
      }
      if(heroPauseButton){
        heroPauseButton.setAttribute('aria-pressed',String(manuallyPaused));
        heroPauseButton.setAttribute('aria-label',manuallyPaused?'Play background slideshow':'Pause background slideshow');
        if(heroPauseLabel)heroPauseLabel.textContent=manuallyPaused?'Play':'Pause';
      }
    }
    if(heroPauseButton){
      heroPauseButton.addEventListener('click',function(){
        manuallyPaused=!manuallyPaused;
        syncHeroTimer();
      });
    }
    document.addEventListener('visibilitychange',syncHeroTimer);
    const onMotionPreferenceChange=function(){
      if(motionPreference.matches)manuallyPaused=true;
      syncHeroTimer();
    };
    if(motionPreference.addEventListener)motionPreference.addEventListener('change',onMotionPreferenceChange);
    else if(motionPreference.addListener)motionPreference.addListener(onMotionPreferenceChange);
    syncHeroTimer();
  }

  const year=document.getElementById('year');
  if(year)year.textContent=String(new Date().getFullYear());
})();