function getRandomIdx(num){
  return Math.floor(Math.random() * num)
}

function isiOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function setIOS(){
  if (isiOS()) {
    document.body.classList.add('ios');
  }
}

function seatsOf300(data){
  // 현재 선거에 데이터 적용
  applyDataToSvg(data);
  // 지난 선거에 데이터 적용
  const previousSeatData = [
    {name: '더불어민주당', value: 163, clan: 'clan001'},
    {name: '미래통합당', value: 84, clan: 'clan002'},
    {name: '미래한국당', value: 19, clan: 'clan002'}, 
    {name: '더불어시민당', value: 17, clan: 'clan001'}, 
    {name: '정의당', value: 6, clan: 'clan003'}, 
    {name: '국민의당', value: 3, clan: 'clan004'}, 
    {name: '열린민주당', value: 3, clan: 'clan005'}, 
    {name: '무소속', value: 5, clan: 'clan00_independent'}, 
  ]
  applyDataToSvg(previousSeatData, 1);
}
function applyDataToSvg(data, idx = 0){
  // value 값이 높은 순서대로 정렬
  data.sort((a, b) => b.value - a.value);
  // 해당 선거 seat SVG 요소 가져오기
  const seatSvg = document.querySelectorAll('.seat')[idx];
  if(!seatSvg){
    return;
  }
  // 데이터에 대해 해당하는 개수만큼 path 요소에 클래스명 추가

  let currentIndex = 0;
  data.forEach((items) => {
    const { value, clan } = items;
    for(let i = 0; i < value; i++){
      const path = seatSvg.querySelectorAll('path')[currentIndex];
      if(path){
        path.classList.add(clan);
      }
      currentIndex++;
    }
  })
}

// rank top 5
function rankTop5(){
  const rankNum = document.querySelectorAll('.rank');
  const sections = document.querySelectorAll('section');
  for(let i = 0; i < 5; i++){
    rankNum[i].classList.add('top')
  }
  sections.forEach(items => {
    items.classList.add('rank');
  })
}

function fixedTabs({fixedTarget, fixedTop}){
  function fixedTabsFunc(){
    if(window.scrollY >= fixedTop - 42){
      fixedTarget.classList.add('fixed');
      document.body.style.paddingTop = fixedTarget.offsetHeight + 'px';
    } else {
      fixedTarget.classList.remove('fixed');
      document.body.style.paddingTop = 0;
    }
  }
  xScrollActive({
    box: document.querySelector('.keyword_swiper'),
    list: document.querySelectorAll('.keyword_swiper li a')
  })  
  window.addEventListener('scroll', function(){
    fixedTabsFunc();
  })
};

// fixed top scroll buttons
function debounce(func, wait, immediate){
  let timeout;
  return function(){
    const context = this;
    const args = arguments;
    const later = function(){
      timeout = null;
      if(!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if(callNow) func.apply(context, args);
  }
}

const handleScroll = debounce(function(){
  const scrollPosition = window.scrollY;
  const targetElement = document.querySelector('.scroll_btns_wrap');
  if(targetElement){
    if(scrollPosition >= 150){
      targetElement.classList.add('active');
    } else {
      targetElement.classList.remove('active');
    }
  }
}, 200); // 200ms 디바운스 설정
window.addEventListener('scroll', handleScroll);

// 메인뉴스 swiper
function mainNewsSwiper(){
  const nav = document.querySelector('.nav');
  const newsClusterSwiperList = document.querySelectorAll('.news_cluster_swiper .swiper-slide');
  const newsClusterTargetSection = document.querySelector('.main_slide');
  const newsClusterSwiper = new Swiper('.news_cluster_swiper', {
    slidesPerView: 1,
    resistanceRatio: 0,
    spaceBetween: 20,
    pagination: {
      el: '.news_cluster_swiper .swiper-pagination',
    },        
    clickable: true,
    navigation: {
      nextEl: '.news_cluster_swiper .next',
      prevEl: '.news_cluster_swiper .prev',
    },
  });

  newsClusterSwiperList.forEach((items, idx) => {
    if(items.id === window.location.search.split('&')[window.location.search.split('&').length - 1]){
      // items.classList.add('target');
      if(items.id !== ''){
        newsClusterTargetSection.classList.add('target');
        setTimeout(() => {
          window.scrollTo({
            top: newsClusterTargetSection.getBoundingClientRect().top - nav.offsetHeight
          })  
        }, 100)
        newsClusterSwiper.slideTo(idx);
      }
    }
  })
}

// 포토뉴스 swiper
// function photoNewsSwiper(){
//   const newsPhotoSwiper = new Swiper('.news_photo_swiper', {
//     slidesPerView: 'auto',
//     spaceBetween: 8,
//     resistanceRatio: 0,
//   })
// }

// 말말말 swiper
function malmalmalSwiper({links}){
  const moreButton = document.querySelector('.cluster_title_more_wrap .talk');
  const malSwiper = new Swiper('.mal_swiper', {
    spaceBetween: 20,
    resistanceRatio: 0,
    autoHeight: true,
    pagination: {
      el: '.mal_swiper  .swiper-pagination',
    },            
  });
  const malButtons = document.querySelectorAll('.mal_buttons li button');
  moreButton.href = links[malSwiper.activeIndex];
  malButtons.forEach((items, idx) => {
    items.addEventListener('click', function(){
      malSwiper.slideTo(idx);
    })
  });
  malButtons[malSwiper.activeIndex].classList.add('active');
  malSwiper.on('slideChange', function(){
    malButtons.forEach(items => items.classList.remove('active'));
    malButtons[malSwiper.activeIndex].classList.add('active');
    moreButton.href = links[malSwiper.activeIndex];
  });

  malSwiper.slideTo(getRandomIdx(malSwiper.slides.length));
}

// 랭킹뉴스 swiper
function rankingNewsSwiper(){
  const newsRankSwiper = new Swiper('.news_rank_swiper', {
    resistanceRatio: 0,
    spaceBetween: 20,
    pagination: {
      el: '.news_rank_swiper .swiper-pagination',
    },          
  })
}


function malTopEvent(){
  malTopMoveComment();
  malTopRolling();
};

// 말말말 화제의 발언 댓글영역 이동
function malTopMoveComment(){
  const commentSection = document.querySelector('.reply_wrap');
  const malTopComment = document.querySelector('.mal_comment');
  malTopComment && (
    malTopComment.addEventListener('click', function(){
      window.scrollTo(0, commentSection.offsetTop - 130);
    })     
  )
}

// 말말말 롤링 이벤트
function malTopRolling(){
  const malRolling = new Swiper('.comment_container', {
    direction: 'vertical',
    resistanceRatio: 0,
    autoplay: {
      delay: 2000,
    },
    loop: true,
    simulateTouch: false,    
  });
}

// 말말말 댓글 쓰기 버튼 클릭 시 댓글 영역 선택 UI 생성
function malCommentCreateUI(){
  const commentSection = document.querySelector('.reply_wrap');
  const commentArticleArea = document.querySelector('.mal_comment_blank_area');
  const malCommentWriteButtons = document.querySelectorAll('.mal_contents .comment');
  const commentArea = document.getElementById('op_write');

  malCommentWriteButtons.forEach(items => {
    items.addEventListener('click', function(items){
      window.scrollTo(0, commentSection.offsetTop - 130);
      commentArea.click();
      const text = items.target.closest("li").querySelector('.mal_text dd').innerText;
      const image = items.target.closest("li").querySelector('.img_wrap img').src;
      const link = items.target.closest("li").querySelector('.mal_text').href;
      const infoName = items.target.closest("li").querySelector('.mal_text .name').innerText;
      const infoClan = items.target.closest("li").querySelector('.mal_text .party').innerText;
      showCommentArticle(text, image, link, infoName, infoClan);
    })
  })
  function showCommentArticle(text, image, link, infoName, infoClan){
      commentArticleArea.classList.add('mal_comment_articles');

      const createCloseButton = document.createElement("button");
      createCloseButton.className = "close";
      createCloseButton.addEventListener('click', hideCommentArticle);

      const createImgwrap = document.createElement("a");
      createImgwrap.className = "img_wrap";
      createImgwrap.href = link;
      const createImg = document.createElement("img");
      createImg.src = image;
      createImg.alt = text;

      const createTextWrap = document.createElement("a");
      createTextWrap.className = "text_wrap";
      createTextWrap.href = link;
      const createTextWrapInfo = document.createElement("div");
      createTextWrapInfo.className = "info";

      const createTextContentName = document.createElement("span");
      createTextContentName.className = "name";
      createTextContentName.textContent = infoName;

      const createTextContentClan = document.createElement("span");
      createTextContentClan.className = "party";
      createTextContentClan.textContent = infoClan;

      const createText = document.createElement("p");
      createText.className = "text";
      createText.textContent = text;

      commentArticleArea.innerHTML = '';
      commentArticleArea.append(createImgwrap, createTextWrap, createCloseButton);
      createImgwrap.append(createImg);
      createTextWrap.append(createTextWrapInfo, createText);
      createTextWrapInfo.append(createTextContentName, createTextContentClan);
  }
  function hideCommentArticle(){
      commentArticleArea.classList.remove('mal_comment_articles');
      commentArticleArea.innerHTML = '';
  }
}

// 말말말 가이드 레이어 팝업 UI
function malGuidePopupUI(){
  const dimmed = document.querySelector('.dimmed');
  const layerPopupButtons = document.querySelectorAll('.mal_guide_button');
  const layerPopup = document.querySelectorAll('.info_layer_popup');
  const guideArea = document.querySelectorAll('.mal_guide_area');
  dimmed.addEventListener('click', function(e){
    if(e.target === e.currentTarget){
      e.target.classList.remove('active');
      closeLayerPopup();
      removeGuideZIndex();
    }
  })
  function removeGuideZIndex(){
    guideArea.forEach(function(items){
      items.classList.remove('active');
    })
  }
  layerPopupButtons.forEach(function(items, idx){
    items.addEventListener('click', function(){
      layerPopup[idx].classList.add('active');
      guideArea[idx].classList.add('active');
      dimmed.classList.add('active');
    })
  })
  function closeLayerPopup(){
    layerPopup.forEach(function(items){
      items.classList.remove('active');
    })
  };
}
function malRemoveButtonsText(){
  const comments = document.querySelectorAll('.mal_count .comment span');
  const updownText = document.querySelectorAll('.up_down_wrap span');

  function removeButtonsText(){
    if(window.screen.width <= 400){
      comments.forEach(function(items){
        if(items.offsetWidth > 28){
          items.parentNode.querySelector('p').style.display = "none";
        }
      })
      updownText.forEach(function(items){
        if(items.offsetWidth > 24){
          items.parentNode.querySelector('p').style.display = "none";
        }
      })
    }
  }
  removeButtonsText();
  window.addEventListener("orientationchange", function(e){
    if(window.innerWidth <= window.innerHeight && window.screen.width >= 400){
      comments.forEach(function(items){
        if(items.offsetWidth > 28){
          items.parentNode.querySelector('p').style.display = "inline"
        }
      })
      updownText.forEach(function(items){
        if(items.offsetWidth > 24){
          items.parentNode.querySelector('p').style.display = "inline";
        }
      })
    } 
    removeButtonsText();
  });
}

// 후보자 > 지역구별 후보 > set toggle
function candidateToggleEvent(data){
  const candidateLocalListMoreButton = document.querySelector('.more_button');
  const candidateLocalList =  document.querySelector('.candidate_search_list');
  const candidateLocalButtons = document.querySelectorAll('.candidate_search_list a');
  const candidateBlank = document.querySelector('.candidate_blank');
  candidateLocalListMoreButton.addEventListener('click', function(e){
    e.target.classList.toggle('active');
    candidateLocalList.classList.toggle('active');
    candidateBlank.classList.toggle('hide');
  })
  candidateLocalButtons.forEach(function(items, idx, array){
    if(items.classList.contains('active')){
      if(items.offsetTop > 50){
        candidateLocalListMoreButton.classList.add('active');
        candidateLocalList.classList.add('active');
        candidateBlank.classList.add('hide');
      }
    }
    function setDisabledButton(){
      if(items.offsetTop < 50){
        candidateLocalListMoreButton.setAttribute('disabled', true);
      } else {
        candidateLocalListMoreButton.removeAttribute('disabled');
      }
    }
    if(idx === array.length - 1){
      setDisabledButton();
      window.addEventListener("resize", function(e){
        setDisabledButton();
      })
    }
  })
}

// 후보자 지역 선택시 활성화 스타일 추가
function candidateSelectActiveStyle(){
  const candidateSelects = document.querySelectorAll('.select');
  candidateSelects.forEach(function(items, idx){
    const stepIdx = idx + 1;
    items.addEventListener('change', function(e){
      const currentValue = e.target.value;
      if(e.target.value !== "default"){
        items.classList.add('active');
        if(candidateSelects[stepIdx]){
          candidateSelects[stepIdx].removeAttribute('disabled')
        } 
      }
      if(currentValue === "default"){
        for(let i = stepIdx; i < candidateSelects.length; i++){
          candidateSelects[i].setAttribute('disabled', 'true');
          candidateSelects[i].classList.remove('active');
          candidateSelects[i].value = "default";
        }
      }
    })
  })
}

// 비례대표 후보 리스트
function candidateToggleTable(){
  const candidateButtons = document.querySelectorAll('.candidate_button');
  const candidateContents = document.querySelectorAll('.candidate_table_wrap');
  candidateButtons.forEach(function(items, idx){
    items.addEventListener('click', function(e){
      candidateContents[idx].classList.toggle('active');
      candidateButtons[idx].classList.toggle('active');
    })
  })
}

function navigationEvent(){
  fixedNaviagtion();
  // xScrollActive();
  disabledGnbPop();
}

// GNB 고정
function fixedNaviagtion(){
  const nav = document.querySelector('.nav');
  const navTop = nav.getBoundingClientRect().top;
  function fixedNav(){
    if(window.scrollY >= navTop + 20){
      nav.classList.add('fixed');
    } else {
      nav.classList.remove('fixed');
    }
  }
  window.addEventListener('scroll', function(){
    fixedNav();
  });
}

// 활성화 메뉴 위치 이동
function xScrollActive({box, list}){
  list.forEach(function(items){
    if(items.classList.contains('active')){
      if(box.className === 'scroll_table_wrap'){
        box.scrollLeft = items.getBoundingClientRect().left - 140;
      } else {
        box.scrollLeft = items.getBoundingClientRect().left - 10;
      }
    }
  })
}
// 비활성화메뉴 레이어 팝업
function disabledGnbPop(){
  const disabledMenus = document.querySelectorAll('.disabled');
  if(disabledMenus){
    disabledMenus.forEach(function(items){
      items.addEventListener('click', function(){
        items.querySelector('.open_date').classList.add('active');
        setTimeout(() => {
          items.querySelector('.open_date').classList.remove('active');
        }, 2000)
      })
    })
  }
}

function showRandomCandidateList(){
  const candidateScrollBox = document.querySelector('.candidate_section > ul');
  const candidateScrollItems = document.querySelectorAll('.candidate_section > ul > li');
  const candidateScrollItemsWidth = Math.floor(candidateScrollBox.scrollWidth / candidateScrollItems.length);
  candidateScrollBox.scrollLeft = candidateScrollItemsWidth * getRandomIdx(candidateScrollItems.length);
}

// 후보자 (VS) VERSUS swiper
function voteVersusSwiper(data){
  const versusTabsBoxes = document.querySelectorAll('.vote_versus_tab_container');
  const versusContentsSwipers = document.querySelectorAll('.vote_versus_contents_container');
  versusContentsSwipers.forEach(function(items, idx){
    if(items.parentElement.querySelector('.mutate_links')){
      items.parentElement.querySelector('.mutate_links').href = data.links[idx][0];
    }
  })

  versusTabsBoxes.forEach((versusTabsBox, index) => {
    const versusTabs = versusTabsBox.querySelectorAll('li button');
    const versusLink = versusTabsBox.parentElement.querySelector('.more');
    const versusContents = new Swiper(versusContentsSwipers[index], {
      spaceBetween: 15,
      pagination: {
        el: versusContentsSwipers[index].querySelector('.swiper-pagination'),
      },
      resistanceRatio: 0,
      navigation: {
        nextEl: versusContentsSwipers[index].querySelector('.next'),
        prevEl: versusContentsSwipers[index].querySelector('.prev')
      },
    });
    versusTabs[versusContents.activeIndex].classList.add('active');
    versusTabs.forEach((item, idx) => {
      item.addEventListener('click', function() {
        versusContents.slideTo(idx);
      });
    });
    versusContents.on('slideChange', function(e) {
      versusTabsBox.scrollLeft = versusTabs[versusContents.activeIndex].offsetLeft - 15;
      versusTabs.forEach((item) => {
        item.classList.remove('active');
      });
      versusTabs[versusContents.activeIndex].classList.add('active');
      if(versusContentsSwipers[index].parentElement.querySelector('.mutate_links')){
        versusContentsSwipers[index].parentElement.querySelector('.mutate_links').href = data.links[index][versusContents.activeIndex];  
      }     
    });
    if(versusContentsSwipers[index].classList.contains('target')){
      versusContentsSwipers[index].querySelectorAll('.swiper-slide').forEach(function(items, idx){
        if(items.id === window.location.search.split('&')[window.location.search.split('&').length - 1]){
          if(items.id !== ''){
            setTimeout(() => {
              window.scrollTo({
                top: document.querySelector('.target_section').getBoundingClientRect().top - document.querySelector('.nav').offsetHeight
              })  
            }, 100)
            versusContents.slideTo(idx);
          }
        }
      })
    }
  });
}

// 개표현황 그래프 %값 제거
function voteHideGraphText(){
  const graphgContainer = document.querySelectorAll('.graph_bar li');
  function getGraphWidth(){
    graphgContainer.forEach(function(items){
      if(items.offsetWidth < 56){
        items.classList.add('hide_text');
      } else {
        items.classList.remove('hide_text');
      }
    });
  }
  getGraphWidth();
  window.addEventListener("resize", function(){
    getGraphWidth();
  });
}

// 투표 swiper 
function voteSwiper(){
  const voteSwipers = document.querySelectorAll('.vote_swipe_container');
  const voteSwiperButtonBoxes = document.querySelectorAll('.vote_swipe_buttons');
  const voteMapLayerPopupLink = document.querySelector('.map_data_popup .more');
  voteSwiperButtonBoxes.forEach((voteSwiperButtonBox, index) => {
    const voteTabs = voteSwiperButtonBox.querySelectorAll('button');
    const voteSwiper = new Swiper(voteSwipers[index], {
      pagination: {
        el: voteSwipers[index].querySelector('.swiper-pagination'),
      },   
      spaceBetween: 15,
      resistanceRatio: 0,
      autoHeight: true
    })
    voteTabs.forEach((item, idx) => {
      item.addEventListener('click', function(){
        voteSwiper.slideTo(idx);
      })
    })
    voteSwiper.on('slideChange', function(){
      voteTabs.forEach(items => items.classList.remove('active'));
      voteTabs[voteSwiper.activeIndex].classList.add('active');
      if(voteMapLayerPopupLink){
        if(voteSwiper.activeIndex === 1){
          voteMapLayerPopupLink.classList.add('hide');
        } else {
          voteMapLayerPopupLink.classList.remove('hide');
        }
      }
    });
  })
}

// 투개표 지도 LayerPopup
function showData(localData, types){
  const mapLocalName = document.querySelector('.map_data_popup .local');
  const mapMoreLink = document.querySelector('.map_data_popup .more');
  const mapDataPopup = document.querySelector('.map_data_popup');
  const dataList = mapDataPopup.querySelector('.data_list');
  mapLocalName.innerText = localData.name;
  mapMoreLink && (
    mapMoreLink.href = localData.link
  );
  dataList.innerHTML = '';
  Object.values(localData.list).forEach(item => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <p><span class="${item.clan} bg"></span>${item.party}</p>
      <span class="count">${types === "ratio" ? Number.parseFloat(item.value).toFixed(1) : item.value}</span>
    `;
    dataList.appendChild(listItem);
  });
  mapDataPopup.classList.add('active');
}

function voteMapSetData(mapData){
  const mapDataPopup = document.querySelector('.map_data_popup');
  const mapCloseButton = document.querySelector('.map_data_popup .close');
  const mapSvgCurrentPaths = document.querySelectorAll('.map_wrap')[0].querySelectorAll('svg path');
  const mapSvgPreviousPaths = document.querySelectorAll('.map_wrap')[1].querySelectorAll('svg path');
  const malLocalCurruntButtons = document.querySelectorAll('.local_tabs')[0].querySelectorAll('li button');
  const malLocalPreviousButtons = document.querySelectorAll('.local_tabs')[1].querySelectorAll('li button');
  function handleClick(localKey, data){
    const localData = data[localKey];
    if (localData) {
      showData(localData, mapData.type);
    }
  }
  Object.keys(mapData.data.current).forEach(function(items){
    const localFirstValue = mapData.data.current[items].list[0].value;
    const localSecondValue = mapData.data.current[items].list[1] ? mapData.data.current[items].list[1].value : 0
    let localClan;
    let setLocalPercent;
    if(localFirstValue === localSecondValue){
      localClan = '';
    } else {
      localClan = mapData.data.current[items].list[0].clan;
    }
    if(mapData.type === 'voteall'){
      setLocalPercent = Math.floor((localFirstValue - localSecondValue) / mapData.data.current[items].seat * 100);
    }
    if(mapData.type === 'ratio'){
      setLocalPercent = localFirstValue;
    }
    function getStep(){
      if(localFirstValue === localSecondValue){
        return '';
      }
      if(setLocalPercent >= 1 && setLocalPercent < 34){
        return 'step1';
      }
      if(setLocalPercent >= 34 && setLocalPercent < 68){
        return 'step2';
      }
      if(setLocalPercent >= 68 && setLocalPercent <= 100){
        return 'step3';
      }
      return;
    }
    getCurrentDataValue(items, localClan, getStep());
  })
  function getCurrentDataValue(target, clan, stepName){
    mapSvgCurrentPaths.forEach(function(items){
      if(items.dataset.local === target){
        items.classList.add(clan + '_' + stepName);
      }
    })
  }

  Object.keys(mapData.data.previous).forEach(function(items){
    const localClan = mapData.data.previous[items].list[0].clan;
    const localFirstValue = mapData.data.previous[items].list[0].value;
    const localSecondValue = mapData.data.previous[items].list[1] ? mapData.data.previous[items].list[1].value : 0
   
    let setLocalPercent;
    if(mapData.type === 'voteall'){
      setLocalPercent = Math.floor((localFirstValue - localSecondValue) / mapData.data.previous[items].seat * 100);
    }
    if(mapData.type === 'ratio'){
      setLocalPercent = localFirstValue;
    }
    function getStep(){
      if(setLocalPercent >= 1 && setLocalPercent < 34){
        return 'step1';
      }
      if(setLocalPercent >= 34 && setLocalPercent < 68){
        return 'step2';
      }
      if(setLocalPercent >= 68 && setLocalPercent <= 100){
        return 'step3';
      }
      return;
    }
    getPreviousDataValue(items, localClan, getStep());
  })

  function getPreviousDataValue(target, clan, stepName){
    mapSvgPreviousPaths.forEach(function(items){
      if(items.dataset.local === target){
        items.classList.add(clan + '_' + stepName);
      }
    })
  }
  function addButtonListeners(buttons, data){
    buttons.forEach(function(button){
      button.addEventListener('click', function(){
        const localKey = this.dataset.local;
        handleClick(localKey, data);
      })
    })
  }
  addButtonListeners(malLocalCurruntButtons, mapData.data.current);
  addButtonListeners(malLocalPreviousButtons, mapData.data.previous);
  malLocalCurruntButtons.forEach(function(button){
    button.setAttribute("disabled", true)
  });
  malLocalPreviousButtons.forEach(function(button){
    button.setAttribute("disabled", true)
  });
  Object.keys(mapData.data.current).forEach((localName) => {
    getDataCurrentLocalName(localName);
  })
  Object.keys(mapData.data.previous).forEach((localName) => {
    getDataPreviousLocalName(localName);
  })
  function getDataCurrentLocalName(name){
    malLocalCurruntButtons.forEach(function(button){
      if(name === button.dataset.local){
        button.removeAttribute("disabled")
      }
    })
  }
  function getDataPreviousLocalName(name){
    malLocalPreviousButtons.forEach(function(button){
      if(name === button.dataset.local){
        button.removeAttribute("disabled")
      }
    })
  }
  mapDataPopup.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });
  mapCloseButton.addEventListener('click', function(){
    mapDataPopup.classList.remove('active');
  });
}

// 타게팅
function sectionTargeting(data){
  let targetList;
  let keywordSwiper;
  if(data.id === "cid"){
    targetList = document.querySelectorAll('.section');
    keywordSwiper = document.querySelector('.keyword_swiper:not(.main)');
  }
  if(data.id === "survey"){
    targetList = document.querySelectorAll('.news_survey_list > li');
    keywordSwiper = document.querySelector('.keyword_swiper:not(.main)');
  }
  if(data.id === "item"){
    targetList = document.querySelectorAll('.mal_target');
    keywordSwiper = document.querySelector('.keyword_swiper:not(.main)');
  }
  if(data.id === "candidate"){
    targetList = document.querySelectorAll('.candidate_title_wrap');
    keywordSwiper = document.querySelector('.candidate_clan_buttons_wrap');
  }
  if(data.id === "candidateList"){
    targetList = document.querySelectorAll('.candidate_button');
    keywordSwiper = document.querySelector('.candidate_clan_buttons_wrap');   
  }
  if(data.id === "count"){
    targetList = document.querySelectorAll('.section');
    keywordSwiper = document.querySelector('.three_depth_menu');
  }
  if(data.id === "newsList"){
    targetList = document.querySelectorAll('.news_cluster_list > li');
    keywordSwiper = document.querySelector('.keyword_swiper:not(.main)');
  }
  const nav = document.querySelector('.nav');

  targetList.forEach(items => {
    if(items.id === window.location.search.split('&')[window.location.search.split('&').length - 1])
    {
      const elTop = items.offsetTop;
      if(items.id !== '' && data.id !== "count"){
        items.classList.add('target');
      }
      if(items.id !== '' && data.id !== "newsList"){
        window.scrollTo({
          top: nav && keywordSwiper ?  
          elTop - ((nav.offsetHeight - 11) + keywordSwiper.offsetHeight) : elTop - (nav.offsetHeight - 11)
        })
      }
      if(items.id !== '' && data.id === "newsList"){
        setTimeout(() => {
          window.scrollTo({
            top: nav && keywordSwiper ?  
            elTop - ((nav.offsetHeight - 11) + keywordSwiper.offsetHeight) : elTop - (nav.offsetHeight - 11)
          })
        }, 300)
      }
    }
  }) 
}

function candidateTargeting(){
  const nav = document.querySelector('.nav');
  const candidateListWrap = document.querySelector('.candidate_title_wrap');
  if(window.location.search.split('&')[window.location.search.split('&').length - 1] === "candidate_target"){
    const elTop = candidateListWrap.offsetTop;
    window.scrollTo({
      top: elTop - (nav.offsetHeight - 11)
    })
  }
}

// 시간대별 투표율 그래프

var Graph = (function(){
  var contr = function(params, id){
      this.target = document.getElementById(id);
      this.ctx = this.target.getContext('2d');
      this.DATA = params;
      this.cacheX = [];
      this.currentIdx;
      this.setCanvasSize();
  }

  let theme = '';
  function handleDarkModeChange(e){
    if(e.matches){
      theme = 'dark';
    } else {
      theme = 'light';
    }
  }
  handleDarkModeChange(window.matchMedia('(prefers-color-scheme: dark)'));
  window.matchMedia('(prefers-color-scheme: dark)').addListener(handleDarkModeChange)

  function drawLine(ctx, X1, Y1, X2, Y2, color) {
      ctx.beginPath();
      ctx.moveTo(X1, Y1);
      ctx.lineTo(X2, Y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
  }
  function drawText(ctx, X, Y, text, value, idx) {
      var rx = X;
      if (idx === 1 && value >= 10) {
          rx = X+4
      } else if (idx === 12) {
          rx = X-3;
      }
      ctx.canvas.style.letterSpacing = '-0.02em';
      ctx.fillStyle = text.color;
      ctx.textAlign = text.align;

      if(text.color === '#fff'){
        ctx.font = text.font;
        ctx.strokeStyle = '#CD20A7';
        ctx.lineWidth = 6;
      } else {
        ctx.font = 'bold 11px Arial',
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2;
      }
      ctx.strokeText(value, rx-0.0, Y-0.0);
      ctx.fillText(value, rx, Y);
  }


  function drawPoint(ctx, X, Y, dotSize, color) {
      ctx.beginPath();
      ctx.arc(X, Y, dotSize, 0, 2*Math.PI);

      // test
      if (dotSize >= 5) {
          ctx.strokeStyle = color
          ctx.lineWidth = 2;
          ctx.fillStyle = 'white';
          ctx.fill('evenodd');
          ctx.stroke();
      } else {
          ctx.fillStyle = color;
          ctx.fill();
      }
  }
  contr.prototype.loop = function (size, f) {
      var cnt = 0;
      while(typeof size && cnt < size) {
          f(this, cnt)
          cnt ++;
      }
  }

  contr.prototype.setCanvasSize = function() {
      // 레티나 대응 > 하지 않을경우  선이 뚜렷하지 않음
      this.width = this.target.clientWidth;
      this.height = this.target.clientHeight;
      this.target.width = this.width;
      this.target.height = this.height;

      var devicePixelRatio = window.devicePixelRatio || 1,
          backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
              this.ctx.mozBackingStorePixelRatio ||
              this.ctx.msBackingStorePixelRatio ||
              this.ctx.oBackingStorePixelRatio ||
              this.ctx.backingStorePixelRatio || 1,
          ratio = devicePixelRatio / backingStoreRatio;

      this.target.width = this.width * ratio;
      this.target.height = this.height * ratio;
      this.ctx.scale(ratio, ratio);
      this.cacheX = []
  }

  contr.prototype.lineGraph = function(data) {
      // 인덱스 설정하기
      this.currentIdx = (function() {
          var i = data.x.length;
          while(i--) {
              if(data.current === 'end') {
                  return data.x.length-2;
                  break;
              }
              if (data.x[i] === data.current) {
                  return i
              }
          }
      })();
      
      var gap  = this.width / data.x.length;
      // 그리드 그리기
      this.loop(data.x.length, function(inst, i){
          var color = inst.currentIdx === i ? data.color : theme === 'dark' ? '#464646' : '#e5e5e5'; // grid color
          var X = gap * i;
          var X2 = X + (gap/2);
          if (inst.currentIdx === i) {
              inst.ctx.fillStyle  = theme === 'dark' ? '#121212' : '#ecedf9';
              inst.ctx.fillRect(X2-15, 0, 30, inst.height);
          }
          drawLine.call(null, inst.ctx, X2, 0, X2, inst.height, color);
          // 구한X값 캐쉬저장
          inst.cacheX.push(X + (gap/2));
      });
      // 투표 데이터 draw
      this.loop(this.DATA.length, function(inst, i) {
          var cnt = 0;
          inst.loop(inst.DATA[i].data.length, function(_this, z){
              var itemValue = _this.DATA[i].data[z];
              var nextItemValue = _this.DATA[i].data[z+1];
              var X1 = _this.cacheX[z];
              var Y1 = _this.height - ((_this.height/100) * itemValue);
              var X2 = _this.cacheX[z+1];
              var Y2 = _this.height - ((_this.height/100) * _this.DATA[i].data[z+1]);
              var color = _this.DATA[i].color;
              if (itemValue) {
                  if (!nextItemValue) {
                      X2 = _this.cacheX[z+2];
                      Y2 = _this.height - ((_this.height/100) * _this.DATA[i].data[z+2]);
                  }
                  drawLine(_this.ctx, X1, Y1, X2, Y2, color);

                  // 집계중일 경우 '%' 표시
                  // var customItemValue = inst.DATA[i].activeData && z === inst.currentIdx ? itemValue.toFixed(1) + '%' : itemValue.toFixed(1);
                                     
                  // 텍스트표시 옵션이 있으면
               
                  if (_this.DATA[i].text) {
                      cnt++;
                      drawText(_this.ctx, X1, Y1-11, (function(){
                          return inst.DATA[i].activeData && z === inst.currentIdx ? {
                              font: 'bold 13px Arial',
                              align: 'center',
                              color: '#fff',
                          } : inst.DATA[i].text;                        
                      })(), itemValue.toFixed(1), cnt)                        
                  }
                  drawPoint(_this.ctx, X1, Y1, (function(){
                      return inst.DATA[i].activeData && z === inst.currentIdx ? 5 : data.dotSize;
                  })(), color);
              }
          })
      });
  }
  return contr;
})();

// 시간대별 투표율 테이블
function voteTimeTable({start, end, current}){
  const scrollTableTimes = document.querySelectorAll('.scroll_time th');
  const getHour = new Date(current).getHours() < 10 ? '0' + new Date(current).getHours() : new Date(current).getHours();
  const getMin = new Date(current).getMinutes() < 10 ? '0' + new Date(current).getMinutes() : new Date(current).getMinutes();
  const scrollTimeCell = document.querySelectorAll('.scroll_time_cell');
  if(new Date() >= new Date(start) && new Date() < new Date(end)){
    if(getHour <= 18){
    scrollTableTimes[getHour - 7].classList.add('active');
    } 
    if(getHour >= 19 && getMin < 30){
      scrollTableTimes[11].classList.add('active');
    }
    if(getHour >= 19 && getMin >= 30){
      scrollTableTimes[12].classList.add('active');
    }   
  }
  scrollTableTimes.forEach(function(items, idx){
    if(items.classList.contains('active')){
      scrollTimeCell.forEach(function(cell){
        cell.querySelectorAll('td')[idx].classList.add('active')
      })
    }
  })
}

// 지도 가이드 팝업
function voteMapGuidePopupUI(){
  const dimmed = document.querySelector('.dimmed');
  const layerPopupButton = document.querySelector('.cluster_title_more_wrap .info');
  const layerPopup = document.querySelector('.map_info_layer_popup');
  dimmed.addEventListener('click', function(e){
    if(e.target === e.currentTarget){
      e.target.classList.remove('active');
      layerPopup.classList.remove('active');
      layerPopupButton.classList.remove('active');
    }
  })
  layerPopupButton.addEventListener('click', function(){
    layerPopup.classList.add('active');
    dimmed.classList.add('active');
    layerPopupButton.classList.add('active');

  })
}

// 페이지 비활성화 링크 & 기사뷰 다크모드 대응
document.addEventListener("DOMContentLoaded", function() {
  const noScrollLinks = document.querySelectorAll('a.disabled');
  if(noScrollLinks){
    noScrollLinks.forEach(function(items){
      items.addEventListener('click', function(event){
        event.preventDefault();
      })
    })
  }

  const viewLinkTexts = document.querySelectorAll('#contents article a');
  if(viewLinkTexts){
    viewLinkTexts.forEach(function(items){
      items.style.color = '';
    })
  }
});



// 헤더 검색창 열고 닫기
(function(){
	addEventListener('DOMContentLoaded', function() {
		var isHissueSnb = document.getElementById('type2');
		// 핫이슈 헤더일 경우 다른 로직
		if (isHissueSnb) {
			var toggleBtn = document.querySelector('#header [aria-expanded]'),
				targetNode = toggleBtn ? document.getElementById(toggleBtn.getAttribute('aria-controls')) : false,
				inputNode = targetNode ? targetNode.querySelector('[type="search"]') : null,
				inputTextDeleteNode = targetNode ? targetNode.querySelector('.delete') : null,
				flag = false,
				inputCheck; // input length Checks

			var resetValue = function (e) {
				e.preventDefault();
				inputNode.value = '';
				inputNode.focus();
			}
			var toggleCloseBtn = function () {
				inputNode = targetNode.querySelector('[type="search"]');
				inputCheck = setInterval(function () {
					if (inputNode.value.length > 0) {
						inputTextDeleteNode.style.display = 'block'
					} else {
						inputTextDeleteNode.style.display = 'none'
					}
				}, 100);
			}
			var removeInput = function (e) {
				e.preventDefault();
				// ios > safari, chrome에서 자음 + 모음 일때 1글자씩 남는 이슈로 인해 삭제후 새 노드 생성
				inputNode = targetNode.querySelector('[type="search"]');
				var newInput = document.createElement('input');
				newInput.type = 'search';
				newInput.placeholder = inputNode.placeholder;
				newInput.name = 'q';
				if (inputNode.name) {
					newInput.name = inputNode.name;
				}
				if (inputNode.id) {
					newInput.id = inputNode.id;
				}

				targetNode.querySelector('fieldset').removeChild(inputNode);
				targetNode.querySelector('fieldset').appendChild(newInput);
        newInput.addEventListener('focus', toggleCloseBtn)
				// addEventHandler(newInput, 'focus', toggleCloseBtn);

        newInput.addEventListener('blur', function(){
					clearInterval(inputCheck);

        })
				// addEventHandler(newInput, 'blur', function () {
				// 	clearInterval(inputCheck);
				// })
				newInput.focus();
			}

			if (toggleBtn) {
				toggleBtn.addEventListener('click', function () {
					if (!flag) {
						olapclick("RAX81");
					}
				})
        toggleBtn.addEventListener('click', function(e){ 
					e.preventDefault();
					flag = !flag;
					inputNode = targetNode.querySelector('[type="search"]');
					toggleBtn.setAttribute('aria-expanded', flag)
					flag ? toggleBtn.classList.add('on') : toggleBtn.classList.remove('on')
					targetNode.style.display = flag ? 'block' : 'none';

					if (inputNode && flag) {
            inputTextDeleteNode.addEventListener('click', removeInput);
            inputNode.addEventListener('focus', toggleCloseBtn)
            inputNode.addEventListener('blur', function(){
							clearInterval(inputCheck);
            })
						inputNode.focus();
						resetValue(e);
					} else {
            inputTextDeleteNode.removeEventListener('click', removeInput);
					}
				});
			}
		} else {
			var snbSearch = document.querySelector('input[type=search]'),
				searchWrap = document.querySelector('.searchWrap'),
				deleteBtn = document.querySelector('.searchWrap .delete'),
				inputCheck;

			var checkValue = function() {
				inputCheck = setInterval(function () {
					if (snbSearch.value.length > 0) {
						deleteBtn.style.display = 'block'
					} else {
						deleteBtn.style.display = 'none'
					}
				}, 100);
			}

			var reset = function (e) {
				e.preventDefault();
				clearInterval(inputCheck);
				snbSearch.value = '';
				deleteBtn.style.display = 'none';
				snbSearch.focus();
			};

			if (snbSearch) {
				addEventHandler(snbSearch, 'focusin', function () {
					// searchWrap.className = 'searchWrap on';
					searchWrap.className = searchWrap.className.indexOf('ab-test') > 1 ? 'searchWrap on ab-test' : 'searchWrap on';
					checkValue();
				});
				addEventHandler(snbSearch, 'focusout', function () {
					// searchWrap.className = 'searchWrap';
					searchWrap.className = searchWrap.className.indexOf('ab-test') > 1 ? 'searchWrap on ab-test' : 'searchWrap';
				});
				addEventHandler(snbSearch, 'blur', function(){
					clearInterval(inputCheck);
				})
				addEventHandler(deleteBtn, 'click', reset);
			}
		}
	});
}());
