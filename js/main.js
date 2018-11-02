$(document).ready(function () {

  var video = document.getElementById("p1-bgvid");
  // var touchEvent = false;
  
  $('#fullpage').fullpage({
    sectionsColor: ['#000', "#fff", '#fff', '#fff', '#fff', '#fff', '#fff', '#fff','#3a1c60'],
    anchors: ['Home', 'About', 'Strategy', "Technology", 'Team', 'Advisors', 'Partners', 'Investors', 'Contact'],
    menu: '#menu',
    scrollingSpeed: 1000,
    // touchDown: 0,
    onLeave: function (index, nextIndex, direction) {
      $('#menu').removeClass("light-background").removeClass("dark-background").addClass("on-background-changing");

      $('.p2-img').toggleClass('active', (index == 1 && direction == 'down') || (index == 3 && direction == 'up'));
      /**** fade out page title */
      // $(".page-title").css({opacity: 0});
    },

    afterLoad: function (anchorLink, index) {
       //** fade in page title */
       $(".section").each(function(){                       
        if($(this).hasClass("active")){
          
            $(this).find(".page-title").css({opacity:1});
            var fadeList = $(this).find(".fade-sect");
            fadeList.map((i, x)=>{                                      //console.log(x, i);
              setTimeout(()=>{$(x).addClass("fadeIn");}, 300*i);
            });
            // $(this).find(".fade-sect").css({opacity:1});

          ///////******** To handle touch event for Mobile *********************/
          if(($(this).hasClass("team")||$(this).hasClass("advisors")) && $(this).attr("touchable")!=="true") {     //console.log("Touch enabled", $(this).attr("class"));
            $(this).on( "touchend mouseup", function (e) {           //console.log(touchDown)
              $(this).attr("touchable", "true");
              
              var n = $(this).find(".button.carBtn.active").prop("number");       //console.log("scroll ",n);
              var len = $(this).find(".button.carBtn").length; console.log(len);
              if(touchDown == 2 && n>=1) {                /////touchDown 2 -> swipe left
                $(this).find(".scroll-"+(n-1)).click();
              }else if(touchDown==3 && n<len-1){             //////touchDown 3 -> swipe right
                $(this).find(".scroll-"+(n+1)).click();
              }
            }).on( "touchmove mousemove", function ( event ) {
              touchDown = 1;
            }).click(function(evt){           //console.log($(evt.target));
              $div = $(evt.target);
              if(!$div.parents(".member").length) {
                hideMemberDesc();
                $(this).find(".member").removeClass("active");
              }
              touchDown =1; 
              // $("li.dropdown").removeClass("show");
            }); 
            /////***************** end touch event ******************* */
          }
          // $(this).click(function(evt){           //console.log($(evt.target));
          //   $div = $(evt.target);
          //   if(!$div.parents(".member").length) {
          //     hideMemberDesc();
          //     $(".member").removeClass("active");
          //   }
          //   touchDown =1; 
          //   $("li.dropdown").removeClass("show");
          // });    
        }else{
          // $(this).fadeOut(300);
          $(this).find(".page-title").css({opacity:0});
          // $(this).find(".fade-sect").removeClass("fadeIn");
        }
        
      });

      if (anchorLink === 'About' || anchorLink === 'Strategy' || anchorLink === 'Team' || anchorLink==='Advisors' || anchorLink === "Partners" || anchorLink === "Investors") {
        $('#menu').removeClass("on-background-changing").removeClass("dark-background").addClass("light-background");
      } else {
        $('#menu').removeClass("on-background-changing").removeClass("light-background").addClass("dark-background");
      }

      if (anchorLink === 'Strategy') {
        $(".p2-img").addClass('active');
      } else if (anchorLink === "Home") {                           console.log("video.paused", video.paused);
        if(video.paused) video.play();
      }
     
    }
  });
  // const root = document.documentElement;
  document.addEventListener("mousemove", evt => {
    
    // root.style.setProperty("--mouse-x", x);
    // root.style.setProperty("--mouse-y", y);
    if($(".section.active").hasClass("About")){
      let x = evt.clientX / innerWidth;
      let y = evt.clientY / innerHeight;
      x = x * -1;
      y = y * -1;
      var left =  x*$(window).width()*.01;
      var top = $(window).height()*.1 + y*$(window).height()*0.01;
       $(".about-bg").css({left: left, top:top, opacity: .5 + Math.abs(y)});        
      //$(".about-bg").css({transform: "translate(x,y)"}); //console.log(x,y);
    }
  });

  $('#menuToggle').click(function () {
    hideMemberDesc();
    $('#menu').toggleClass('menu-show');
    if($("#menu").hasClass("menu-show")) {
      $(".member").removeClass("active");
    }else $("li.dropdown").removeClass("show");
  });

  $("#menu li a.aLink").click(function(e){             
      if( $(this).hasClass("translate-menu-language") || $(this).hasClass("translate-menu-whitepaper")){       //console.log($("ul.dropdown-menu").hasClass("show"))        
        $(this).parent('li.dropdown').toggleClass('show');
        // if(!$("#menu li.dropdown").hasClass("show")) $("li.dropdown").addClass("show");
        // else $("li.dropdown").removeClass("show");
        return;
      }
      $("li.dropdown").removeClass("show");
      hideMemberDesc();
      if($("#menu").hasClass("menu-show")) $("#menu").removeClass("menu-show");  
      if($("#menuToggle input").attr("checked")) $("#menuToggle input").removeAttr("checked");    
      
  });
  if($(window).width()>768){
    $("#menu li.dropdown").mouseenter(function(e){        //console.log(e)
      $(this).addClass("show");                           
    })
  
    $("li.dropdown").mouseleave(function(e){          //console.log(e)
      $(this).removeClass("show"); 
    })
  }
 

  //////////////////////////////////translation
  $.getJSON("js/translation.json",function(data){
    translations=data;
    setContent();
  });


  /****** carouse ******* */
  // var carouselPageNB = Math.ceil(($(".team .team-members").children().length / 3));             
  var initCarousel = function (sect) {                     
    var section = $(sect);                    console.log("team/advisor members: ", section.find(".team-members .member").length)
    var carouselPageNB = Math.ceil(section.find(".team-members .member").length / 3); 
                                                      
    section.find(".team-members").css({ width: carouselPageNB * 100 + "%" });
    var carouselMenu = section.find(".carousel-menu");                         
    for (var i = 0; i < carouselPageNB; i++) {
      carouselMenu.append("<div class='button carBtn scroll-" + i + "' ></div>");
      section.find(".scroll-" + i)
        .prop("number", i)
        .on('click', function () {            
          // remove member description layer
          hideMemberDesc();
          var number = $(this).prop("number");                                         //console.log(number);
          var rightNumber = $(window).width() >768 ? 100 : 100;  //104
          section.find(".team-members").animate({ right: number * rightNumber + "%" });
          resetCarousel(section, carouselPageNB);
          // $(".team .title").text("Our Team");
          $(this).css("background-color", "#000").addClass("active");
        });
    }
    section.find(".scroll-0").css("background-color", "#000").addClass("active");
  }
  var resetCarousel = function (section, carouselPageNB) {
    for (var i = 0; i < carouselPageNB * 3; i++) {
      section.find(".scroll-" + i).css("background-color", "transparent").removeClass("active");
    }
  }

  // var width = $(".team .content").css('width');    console.log(width)
  // if (parseInt(width.replace("%", "")) == 100) {
  //   width = parseInt(width.replace("%", '')) / 100 * $(window).width();
  // }
  // width = width.toString().replace("%", "").replace("px", "");      console.log(width)
  // function changeCarouselSelector() {
  //   width = $(".team .content").css('width');
  //   if (parseInt(width.replace("%", "")) == 100) {
  //     width = parseInt(width.replace("%", '')) / 100 * $(window).width();
  //   }
  //   width = width.toString().replace("%", "").replace("px", "");
  //   var right = $(".team-members").css("right").replace("px", "");
  //   resetCarousel();
  //   var pxwidth = parseInt(width);
  //   for (var i = 0; i < carouselPageNB; i++) {
  //     if (right > (i * pxwidth) - 2 && right < (i * pxwidth) + 2) {
  //       $(".scroll-" + i).css("background-color", "#000");
  //     }
  //   }
  // }

  initCarousel(".team");
  initCarousel(".advisor");
  /****** end carouse ******* */

  // ******************** team member pop up *********************/
  if($(window).width()<=768)
    $(".member").click(function(){      
      if($(this).hasClass("empty")) return;           
      // if($(this).find(".member-desc").is(":visible")) return;     // to make sure member desc invisible
      if($(this).hasClass("active")) {
        $(this).removeClass("active");
        hideMemberDesc();
        return;
      }                          //console.log($(this));
      hideMemberDesc();
      $(".member").removeClass("active");
      $(this).addClass("active");
      var left = $(this).find(".member-name").offset().left+12;
      var top = $(this).offset().top;
      var img = $(this).find("img").css("border", "1px solid #999");       // console.log(img.offset().top, img.width());
      var _desc = $(this).find(".member-desc").html();                     //console.log(_desc)
      var _descClassName = $(this).find(".member-desc").attr("class").split(" ")[1];         //console.log(_descClassName);

      var layer = $("<div>").attr("id", "layer")
                  .css({"left": left, "top": top})
                  .appendTo($("body"));
      var desc = $("<div>").attr("id", "description").addClass(_descClassName).html(_desc).appendTo(layer);
      top = img.offset().top + img.height()/2 - desc.height()/2;
      layer.css({top: top});
      var style = '<style>div#layer::before{top:'+desc.height()/2+'px;}</style>'; //console.log(style);
      $('head').append(style);
      layer.css({height: desc.height()});
      // layer.animate({height: desc.height()}, 300);
    });
//*****************  end team member pop up */
  $(".translate-p1-download").click(function () {   //console.log( $("#selectedLang").val() );
      var lang = $("li.dropdown").attr("data-lang");            
      if (lang !== "en") {
        // window.open('https://s3.us-east-2.amazonaws.com/nebula-ai/file/NBAI_whitepaper_CN.pdf')
        window.open("whitepaper/NBAI_whitepaper_CN.pdf")
      } else {
        // window.open('https://s3.us-east-2.amazonaws.com/nebula-ai/file/NBAI_whitepaper_EN.pdf')
        window.open("whitepaper/NBAI_whitepaper_EN.pdf");
      }
  });
  $(".video .playBtn").click((e)=>{             //console.log(e.target); 
    $(e.target).hide();
    var aboutVideo = document.getElementById("aboutVideo");
    aboutVideo.setAttribute("controls", "controls");
    aboutVideo.play();
    // $(this).fadeOut();
  });
    
});

function showVideo(){      console.log("iframe")
  var layer = $("<div>").attr("id", "vLayer")
                  .appendTo($("body"));
  // $('#aboutVideo').clone().attr("id", "cVideo").appendTo(layer);
  $('<iframe type="text/html" src="https://www.youtube.com/embed/FbvftQ-0odY?loop=1" frameborder="0"></iframe>')
    .appendTo(layer);
    layer.click((e)=>{    
      // document.getElementById("cVideo").pause();
      layer.remove();
    });
}
function hideMemberDesc(){
    if($("div#layer").length){
        $("div#layer").remove();
        $(".team-members").find("img").css("border", "none");
        $('head').find("style").remove();
    } 
}
function resizeLayer(){
  if($("div#layer").length){  //console.log($("#description").height(), $("div#layer").height());
    $("div#layer").css({height:$("#description").height() });
  }
}

var translations;
function setContent(lang="en"){
  for(var x = 0; keys = Object.keys(translations[lang]), x < keys.length;x++){
    $(".translate-"+keys[x].toDash())
      .text("")
      .append(translations[lang][keys[x]]);
  }
  // $("ul.dropdown-menu").animate({top:"0"}, 300, ()=>{
     $("li.dropdown").attr("data-lang", lang).removeClass("show");
  // });
 
  // $('#menuToggle').click();
  resizeLayer();
}
String.prototype.toDash = function(){
  return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};

