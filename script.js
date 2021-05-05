var slideWrap = document.querySelector(".slide_wrap"),
    slide = document.querySelectorAll(".slide_wrap .slide"),
    currentIndex = 0,
    slideCount = slide.length,
    slideWidth,
    slideMargin,
    slideTo,
    newSlide,
    newSlideWidth,
    showSlide,
    screenWidth = document.querySelector("body").offsetWidth,
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next");

// 1. 슬라이드 복사 함수

function copySlide() {
    for (var i = 0; i < slideCount; i++) {
        // a.cloneNode() : a 요소 복사
        // a.cloneNode(true) : a의 자식 요소까지 복사
        var cloneSlide = slide[i].cloneNode(true);
        cloneSlide.classList.add("clone");
        // a.appendChild(b) : a 안에 기존의 내용 뒤에 b를 추가
        slideWrap.appendChild(cloneSlide);
    }

    for (var i = slideCount - 1; i >= 0; i--) {
        var cloneSlide = slide[i].cloneNode(true);
        cloneSlide.classList.add("clone");
        // a.prepend(b) : a 안에 기존의 내용 앞에 b를 추가
        slideWrap.prepend(cloneSlide);
    }
}

// 2. 슬라이드 가로 배열 함수

function slideArray() {
    newSlide = document.querySelectorAll(".slide_wrap .slide");
    newSlide.forEach(function (item, index) {
        item.style.width = newSlideWidth + "px";
        item.style.left = slideTo * index + "px";
    });
}

// 3. 슬라이드 중앙 배치 함수

function slideCenter() {
    var beforeSlideTo = -slideTo * slideCount + "px";
    slideWrap.style.transform = "translateX(" + beforeSlideTo + ")";

    // slideWrap.classList.add('animated'); // 문제 : 처음에 로드될 때 transition이 보임
    setTimeout(function () {
        slideWrap.classList.add("animated");
    }, 100); // 시간이 지나고 실행 // 해결
}

// 4. 슬라이드 가로, 마진 자동 사이즈 함수

function slideAutoWidth() {
    var slideWrapWidth = slideWrap.offsetWidth;
    newSlideWidth = (slideWrapWidth - slideMargin * (showSlide - 1)) / showSlide;
    slideTo = newSlideWidth + slideMargin;
}

// 5. 각 슬라이드 높이 중 가장 큰 높이를 부모의 높이로 지정 함수

function autoHeight() {
    var slideContainer = document.querySelector(".slide_container"),
        highest = 0;

    for (var i = 0; i < slideCount; i++) {
        if (slide[i].offsetHeight > highest) {
            highest = slide[i].offsetHeight;
        }
    }
    // console.log(slide[1].offsetHeight);
    // console.log(slide[2].offsetHeight);
    // console.log(slide[3].offsetHeight);
    // console.log(slide[4].offsetHeight);
    // console.log(slide[5].offsetHeight);
    // console.log('가장높은높이', highest);

    slideContainer.style.height = highest + "px";
    slideWrap.style.height = highest + "px";
}

// 6. [반응형] 함수 실행

if (screenWidth < 576) {
    newSlideWidth = slideWrap.offsetWidth;
    slideTo = newSlideWidth;
} else if (screenWidth < 768) {
    showSlide = 2;
    slideMargin = 10;
} else if (screenWidth < 992) {
    showSlide = 3;
    slideMargin = 20;
} else if (screenWidth < 1200) {
    showSlide = 4;
    slideMargin = 30;
} else {
    showSlide = 5;
    slideMargin = 40;
}

if (screenWidth >= 576) {
    slideAutoWidth();
}

copySlide();
slideArray();
slideCenter();
autoHeight();

window.addEventListener("resize", function () {
    var screenWidth = document.querySelector("body").offsetWidth;

    goToSlide(0); // 리사이즈하면 배열이 엉망되서 초기화

    if (screenWidth < 576) {
        newSlideWidth = slideWrap.offsetWidth;
        slideTo = newSlideWidth;
    } else if (screenWidth < 768) {
        showSlide = 2;
        slideMargin = 10;
    } else if (screenWidth < 992) {
        showSlide = 3;
        slideMargin = 20;
    } else if (screenWidth < 1200) {
        showSlide = 4;
        slideMargin = 30;
    } else {
        showSlide = 5;
        slideMargin = 40;
    }

    if (screenWidth >= 576) {
        slideAutoWidth();
    }

    copySlide();
    slideArray();
    slideCenter();
    autoHeight();
});

// 7. 좌우 버튼으로 이동하기

next.addEventListener("click", function () {
    goToSlide(currentIndex + 1);
});

prev.addEventListener("click", function () {
    goToSlide(currentIndex - 1);
});

function goToSlide(num) {
    slideWrap.style.left = -num * slideTo + "px";
    currentIndex = num;
    // console.log(currentIndex, slideCount);

    if (currentIndex == slideCount || currentIndex == -slideCount) {
        // 문제 2. 문제 1 해결을 위해 클래스 제거했지만 마지막 페이지에서 처음 페이지로 갈 때 transition이 안보임
        // slideWrap.classList.remove('animated');

        // 문제 1. 마지막 페이지에서 처음 페이지로 갈 때 transition이 보임
        // slideWrap.style.left = '0px';
        // currentIndex = 0;

        setTimeout(function () {
            slideWrap.classList.remove("animated");
            slideWrap.style.left = "0px";
            currentIndex = 0;
        }, 500); // 문제 3. 문제 2 해결을 위해 setTimeout으로 처리했지만 transition이 사라짐

        setTimeout(function () {
            slideWrap.classList.add("animated");
        }, 600); // 해결
    }
}

// 8. 자동 슬라이드

var timer = undefined;

function autoSlide() {
    if (timer == undefined) {
        timer = setInterval(function () {
            goToSlide(currentIndex + 1);
        }, 2000);
    }
}
autoSlide();

function stopSlide() {
    clearInterval(timer);

    // stopSlide 후 다시 autoSlide할 때 timer의 값이 undefined이 아니라 숫자로 바껴있음
    // console.log(timer); // 2
    timer = undefined;
    // console.log(timer); // undefined
}

slideWrap.addEventListener("mouseenter", function () {
    stopSlide();
});

slideWrap.addEventListener("mouseleave", function () {
    autoSlide();
});
