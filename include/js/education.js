let m_this_name = "education";
let m_contents_url = "";
let m_notice_mode = "";
let m_root_url = "";
let m_education_list = [];
let m_trophy_list = [];

let m_contents_json = null;
let m_main_swiper = null;
let m_img_swiper = null;
let academic_events = [];


function setInit() {
    console.log(m_this_name + " Init");
    if (this.PAGEACTIVEYN == true) {
        setLoadSetting("include/setting.json");
    }

    $('.list_contents li').on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickMainMenu(this);
    });

    m_img_swiper = new Swiper('.img_swiper', {
        spaceBetween: 200, //슬라이드 간격
        centeredSlides: true,
        slidesPerView: 'auto', // 자동으로 슬라이드 너비 설정
        watchOverflow: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });
}

function setLoadSetting(_url) {
    $.ajax({
        url: _url,
        dataType: 'json',
        success: function (data) {
            m_contents_url = data.setting.content_url;
            //키오스크 컨텐츠의 주소
            m_root_url = data.setting.root_url;
            //이미지 로드를 위한 기본 root주소
            m_notice_mode = data.setting.notice_mode;
            //모드가 web이면 파일 주소를 보정함
            m_web_server_port = data.setting.web_server_port;
            //중소기업 중앙회에서는 사용하지 않음
            setContents();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}
//초기화
function setInitSetting() {

    setImgListUp();

    $("#id_img_1").attr("src", convFilePath(m_education_list.history_file_path));
    $("#id_img_list .img_zone img").hide();

    onClickMainMenu($(".list_contents li[code='1']"));
    $("#id_calendar").show();

    m_education_list.academic_list.forEach(function (item) {
        var current_date = new Date(item.start);
        var end_date = new Date(item.end);

        // 시작일부터 종료일까지 하루씩 더해가며 배열에 push
        while (current_date <= end_date) {
            academic_events.push({
                id: item.id + "_" + current_date.toISOString().split('T')[0], // ID 중복 방지
                title: item.title,
                start: current_date.toISOString().split('T')[0],
                allDay: true,
                display: 'block' // 텍스트가 꽉 차게 표시되도록 설정
            });

            // 날짜를 하루 더함
            current_date.setDate(current_date.getDate() + 1);
        }
    });
    
    console.log(academic_events);

    setMakeCalander();

}
//kiosk_contents를 읽기
function setContents() {
    var t_url = m_contents_url;
    $.ajax({
        url: t_url,
        dataType: 'json',
        success: function (data) {
            m_header = data.header;
            m_education_list = data.education_list;
            m_img_list = data.education_list.photo_list;
            setInitSetting();
        },
        error: function (xhr, status, error) {
            console.error('컨텐츠 에러 발생:', status, error);
        },
    });
}

function setImgListUp() {
    $('#id_img_swiper_wrapper').html("");
    if (m_img_list.length == 0) {
        return;
    }
    let t_max = 8;
    let t_html = "";
    let r_html = "";
    let page_cnt = Math.ceil(m_img_list.length / t_max);
    for (let i = 0; i < page_cnt; i += 1) {
        t_html += "<ul id='id_img_wrap_" + i + "' class='swiper-slide'>";
        t_html += "</ul>";
    }
    $('#id_img_swiper_wrapper').append(t_html);
    for (let i = 0; i < m_img_list.length; i += 1) {
        let t_id = Math.floor(i / t_max);
        r_html += "<li onClick='javascript:onClickImg(" + i + ");'>";
        r_html += "    <button>";
        r_html += "        <span class='img_zone'>";
        r_html += "            <div class='cover'></div>";
        r_html += "            <img src=" + convFilePath(m_img_list[i].file_list[0].file_path) + ">";
        r_html += "        </span>";
        r_html += "        <span class='txt_zone'>";
        r_html += "            <b>" + m_img_list[i].title + "</b>";
        r_html += "            <i>" + m_img_list[i].date + "</i>";
        r_html += "        </span>";
        r_html += "    </button>";
        r_html += "</li>";
        $('#id_img_wrap_' + t_id).append(r_html);
        r_html = "";
    }

    m_img_swiper.slideTo(0, 0);
    m_img_swiper.update();
}

function onClickImg(_id) {
    if (this.PAGEACTIVEYN == false) {
        window.parent.setPopupImg(m_img_list[_id]);
    }
}

function setDataInit(_contents, _notice_mode) {
    m_notice_mode = _notice_mode;
    setInit();
    m_contents_json = _contents;
    m_header = m_contents_json.header;
    m_education_list = m_contents_json.education_list;
    m_img_list = m_contents_json.education_list.photo_list;
    setInitSetting();
}

function onClickMainMenu(_obj) {
    //    console.log(_obj);
    let t_code = $(_obj).attr('code');
    $('.list_contents li').removeClass('active');
    $(`.list_contents li[code="${t_code}"]`).addClass('active');
    $(".title h2").html($(`.list_contents li[code="${t_code}"]`).text());
    setPage(t_code);
}

function setPage(_code) {
    $("#id_photo_list").hide();
    $("#id_calendar").hide();
    $("#id_img_list").hide();
    $("#id_img_list .img_zone img").hide();
    let t_code = parseInt(_code);

    if (t_code == 1) {

    } else if (t_code == 2) {
        $("#id_calendar").show();
    } else if (t_code == 3) {

    } else if (t_code == 4) {

    } else if (t_code == 5) {
        m_img_swiper.slideTo(0, 0);
        $("#id_photo_list").show();

    }
}


function setMainReset() {
    onClickMainMenu($(".list_contents li[code='1']"));
}


function onClickBtnBack() {
    window.parent.setMainReset();
}


function setMainInterval() {
    var time_gap = 0;
    var time_curr = new Date().getTime();

    time_gap = time_curr - m_time_last;
    time_gap = Math.floor(time_gap / 1000);
}

function setDateTime() {
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜
    let day = today.getDay(); // 요일
    let rour = today.getHours();
    let min = today.getMinutes();
}


function setMakeCalander() {

    var calendar_el = document.getElementById('calendar_main');

    var calendar_obj = new FullCalendar.Calendar(calendar_el, {
        initialView: 'dayGridMonth',
        initialDate: '2025-12-01',
        locale: 'ko',
        headerToolbar: false,
        contentHeight: 900,
        // 5. 불필요한 아랫줄 제거 (고정 6주가 아닌 해당 월의 주 수만큼만 표시)
        fixedWeekCount: false, // 6. 날짜 형식 변경 (3일 -> 3)
        dayCellContent: function (info) {
            var number = info.dayNumberText.replace('일', '');
            return {
                html: '<div>' + number + '</div>'
            };
        },
        dayMaxEvents: true,

        dayHeaderContent: function (arg) {
            var week_days = ['일', '월', '화', '수', '목', '금', '토'];
            return week_days[arg.date.getDay()];
        },

        events: academic_events
    });

    calendar_obj.render();

    $("#id_calendar").hide();

}
