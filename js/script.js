///////////////////////////////////
/* GSAP animation implementation */
///////////////////////////////////

// elapsed time variables
const _3D_welcome_contents = 16750; // anim1
const _3D_candDetail_modelTop = 1800; // anim_top
const _3D_modelTop_candDetail = 1900; // anim_top_back
const _3D_modelTop_contents = 1200; // anim_down
const _3D_logo_forward = 1200; // mark_forward
const _3D_logo_backward = 1200; // mark_backward

const _conts_contact3 = 4000;
const _contact3_conts = 5000;
const _conts_contact2 = 6400;
const _contact2_conts = 7200;

const ID_index = {
  content: {
    flame: "#cont_flame",
    description: "#desc1",
    detailPg: "#details-cont",
    offset: "500vh",
    animDelay: [10000, 7900],
    threeDAnimation: [anim_content, anim_content_back],
    threeDAnimDelay: [6.0, 3.5],
    threeDAnimTop: [anim_candidate_top, anim_candidate_top_back], // [anim_content_top, anim_content_top_back],
    threeDAnimTopDelay: [6400, 7200],
  },
  client: {
    flame: "#cli_flame",
    description: "#desc2",
    detailPg: "#details-cli",
    offset: "600vh",
    animDelay: [10500, 9200],
    threeDAnimation: [anim_clients, anim_clients_back],
    threeDAnimDelay: [6.0, 4.5],
    threeDAnimTop: [anim_clients_top, anim_clients_top_back],
    threeDAnimTopDelay: [6400, 7200],
  },
  candidates: {
    flame: "#cands_flame",
    description: "#desc3",
    detailPg: "#details-cands",
    offset: "700vh",
    animDelay: [10500, 11700],
    threeDAnimation: [anim_candidate, anim_candidate_back],
    threeDAnimDelay: [6.5, 7.0],
    threeDAnimTop: [anim_candidate_top, anim_candidate_top_back],
    threeDAnimTopDelay: [6400, 7200],
  },
};

//hide pdf button
$("#pdfBtn").hide();

// flashingLogoCopy
gsap.to("#glowCopy feDropShadow", {
  duration: 2,
  attr: { stdDeviation: 0 },
  repeat: -1,
  yoyo: true,
});

// main GSAP timeline object
let master = gsap.timeline();

// set subcontents of 'contents' page to 'opacity:0; visibility:hidden'
master.set([".description", ".flame", "#flashingLogoCopy"], {
  autoAlpha: 0,
});

// register the effect with GSAP: flame effect
gsap.registerEffect({
  name: "flame",
  effect: (targets, config) => {
    return gsap
      .timeline({
        repeat: config.time,
      })
      .set(targets, { rotation: 0, clearProps: "all" })
      .to(targets, { duration: 0.25, autoAlpha: 1 })
      .to(
        targets,
        {
          duration: 0.5,
          rotation: -360,
          repeat: 2,
          ease: Linear.easeNone,
          transformOrigin: "0% 50%",
        },
        "-=0.25"
      )
      .to(targets, {
        duration: 0.25,
        autoAlpha: 0,
      });
  },
  defaults: {}, //defaults get applied to any "config" object passed to the effect
  extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
});

// change animation of logoName from uniform filling to gradient one
const changeAttr = () => {
  let eles = document.querySelectorAll(".svganim");
  eles.forEach((ele) => {
    ele.setAttribute("fill", "url(#theGradient)");
  });
};

// welcome screen words popup
const messagePopup = () => {
  const container = $("#message");
  const chunks = ["WELCOME", "TO", "THE", "FUTURE", "OF", "FINANCIAL", "UNDERSTANDING"];

  let tl = new gsap.timeline(),
    time = 0,
    chunk,
    element;

  for (let i = 0; i < chunks.length; i++) {
    chunk = chunks[i];
    let index = chunk.length === 1 ? 0 : Math.floor(chunk.length / 2);
    if (chunk.length === 6) index = 2;
    element = $(
      "<h3>" +
        chunk.substring(0, index) +
        "<span>" +
        chunk[index] +
        "</span>" +
        chunk.substring(index + 1, chunk.length) +
        "</h3>"
    ).appendTo(container);
    //
    if (chunk.length == 2) {
      element.css("transform", "translate(-75%, -50%)");
    } else if (chunk.length === 6) {
      element.css("transform", "translate(-45%, -50%)");
    } else if (chunk.length > 10) {
      element.css("transform", "translate(-53%, -50%)");
    }
    disappearDuration = 0.02;
    if (i == 0) {
      gsap.set(element, { autoAlpha: 0, scale: 2 });
      tl.to(element, 0.15, { autoAlpha: 1, scale: 1 }, time).to(
        element,
        disappearDuration,
        { autoAlpha: 0 },
        "+=0.35"
      );
      time += 0.5;
    } else {
      gsap.set(element, { autoAlpha: 0, scale: 1 });
      if (i == 1 || i == 2 || i == 5) {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          disappearDuration,
          {
            autoAlpha: 0,
          },
          "+=0.25"
        );
        time += 0.3;
      } else if (i == 3 || i == 4) {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          disappearDuration,
          {
            autoAlpha: 0,
          },
          "+=0.35"
        );
        time += 0.4;
      } else if (i != chunks.length - 1) {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          disappearDuration,
          {
            autoAlpha: 0,
          },
          "+=0.45"
        );
        time += 0.5;
      } else {
        tl.to(element, 0.05, { autoAlpha: 1 }, time).to(
          element,
          0.1,
          {
            autoAlpha: 0,
            scale: 0,
          },
          "+=0.45"
        );
        time += 0.6;
      }
    }
  }
};

// logoName -> welcome -> 3d start animation
function logoWelcomeThreeD(skipping = false) {
  let animation = gsap.timeline();
  animation
    .to("#vertLine stop", {
      delay: 1,
      duration: 3,
      attr: { offset: "0%" },
      ease: Linear.easeNone,
      onComplete: changeAttr,
    })
    .to("#topStop", {
      duration: 1.5,
      delay: 1,
      attr: { offset: "0%" },
      ease: Linear.easeNone,
    })
    .to("#topStop", {
      duration: 0.5,
      attr: { "stop-color": "#666" },
    })
    .to(".company-logo-name-page", {
      delay: 0.5,
      duration: 1.5,
      autoAlpha: 0,
      ease: Linear.easeNone,
    })
    .to(".company-logo-name-page", {
      duration: 0.5,
      y: "-200vh",
    })
    .to(
      ".welcome-page",
      {
        duration: 0.5,
        y: "-100vh",
        onComplete: messagePopup,
      },
      "-=0.5"
    )
    .to(
      ".welcome-page",
      {
        duration: 0.01,
        translateY: "-200vh",
      },
      "+=3.3"
    )
    .to(
      ".threeD-panel",
      {
        duration: 0.01, // 3d panel translate (0,200vh) => (0,0): 0.1s
        translateY: "-200vh",
      },
      "-=0.01"
    )
    .call(render);
  if (!skipping) {
    animation.call(anim_start);
  }

  animation.to(".threeD-panel", {
    duration: 1.5, // 3d panel brighten: 1.5s
    autoAlpha: 1,
  });
  return animation;
}

// tl-floating-logo appear animation while first 3D animation
function flashingLogoAppear() {
  let animation = gsap.timeline();
  animation.set("#flashingLogo", {
    autoAlpha: 1,
    translateX: "-8vw",
    rotation: "-120deg",
  });
  animation.set("#fl-contact span", {
    autoAlpha: 0,
  });
  animation
    .to("#fl-contact", {
      duration: 0.1,
      translateY: "-200vh",
    })
    .to("#flashingLogo", {
      duration: 1.5,
      x: 4,
      rotation: "0deg",
      ease: "slow(0.7, 0.1, false)",
    })
    .to(
      "#hamburgerMenu",
      {
        duration: 1.5,
        autoAlpha: 1,
      },
      "-=1.5"
    )
    .to("#fl-contact span", {
      duration: 1,
      autoAlpha: 1,
    });

  gsap.to(["#glow feDropShadow", "#hamglow feDropShadow"], {
    duration: 2,
    attr: { stdDeviation: 0 },
    repeat: -1,
    yoyo: true,
  });

  return animation;
}

// "contents" page titles appear
function mainPgContentsAppear() {
  let animation = gsap.timeline();
  animation.to(".mainContent", {
    duration: 0.2,
    translateY: "-300vh",
  });
  animation
    .fromTo(
      ".logo svg",
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 2,
      }
    )
    .fromTo(
      ".mainContent-title",
      {
        x: "-101%",
        autoAlpha: 0,
      },
      {
        x: "0",
        autoAlpha: 1,
        duration: 2,
      },
      "-=2"
    );

  return animation;
}
// "contents" page titles disappear
function mainPgContentsDisappear() {
  let animation = gsap.timeline();
  animation
    .to(".logo svg", {
      duration: 1,
      autoAlpha: 0,
      x: -50,
      ease: "slow(0.7, 0.1, false)",
    })
    .to(
      ".mainContent-title",
      {
        duration: 1,
        x: 50,
        autoAlpha: 0,
        ease: "slow(0.7, 0.1, false)",
      },
      "-=1"
    )
    .to(".mainContent", {
      duration: 0.2,
      translateY: "300vh",
    })
    .set([".logo svg", ".mainContent-title"], {
      autoAlpha: 0,
      x: 0,
    });

  return animation;
}

function detailPgAppear(type) {
  let animation = gsap.timeline();
  animation
    .set(ID_index[type].detailPg, {
      autoAlpha: 0,
    })
    .to(ID_index[type].detailPg, {
      delay: ID_index[type].threeDAnimDelay[0],
      duration: 0.1,
      translateY: "-" + ID_index[type].offset,
    })
    .to(ID_index[type].detailPg, {
      duration: 2,
      autoAlpha: 1,
      ease: "power2.out",
    })
    .to(
      ".path",
      {
        duration: 2,
        "stroke-dashoffset": 0,
      },
      "-=2"
    )
    .to("#rectglow feDropShadow", {
      duration: 1,
      attr: { stdDeviation: 2 },
      repeat: -1,
      yoyo: true,
    });

  return animation;
}
function detailPgDisappear(type) {
  let animation = gsap.timeline();
  animation
    .set("#rectglow feDropShadow", {
      attr: { stdDeviation: 0 },
    })
    .to(".path", {
      duration: 2,
      "stroke-dashoffset": 1000,
    })
    .to(ID_index[type].detailPg, {
      duration: 1,
      autoAlpha: 0,
      ease: "power2.out",
    })
    .to(ID_index[type].detailPg, {
      duration: 0.1,
      translateY: ID_index[type].offset,
    });
  return animation;
}

function contact3Appear() {
  let animation = gsap.timeline();
  animation
    .add(fl_contact_goback(), "-=1")
    .set(".contact-us-three-options", {
      autoAlpha: 0,
    })
    .to(".contact-us-three-options", {
      duration: 0.1,
      translateY: "-400vh",
    })
    .to(
      ["#fl-back", ".contact-us-three-options"],
      {
        duration: 2,
        autoAlpha: 1,
        ease: "slow(0.7, 0.1, false)",
      },
      "+=1.8"
    )
    .to(
      ".path",
      {
        duration: 2,
        "stroke-dashoffset": 0,
      },
      "-=2"
    )
    .to("#rectglow feDropShadow", {
      duration: 1,
      attr: { stdDeviation: 2 },
      repeat: -1,
      yoyo: true,
    });
  return animation;
}
function contact3Disappear() {
  let animation = gsap.timeline();
  animation
    .set("#rectglow feDropShadow", {
      attr: { stdDeviation: 0 },
    })
    .to(".path", {
      duration: 2,
      "stroke-dashoffset": 1000,
    })
    .add(fl_goback_contact(), "-=2")
    .to(
      ".contact-us-three-options",
      {
        duration: 0.1,
        autoAlpha: 0,
      },
      "-=0.1"
    )
    .to(
      ".contact-us-three-options",
      {
        duration: 0.1,
        translateY: "400vh",
      },
      "+=1.8"
    )
    .to("#fl-contact", {
      duration: 0.1,
      autoAlpha: 1,
    });
  animation.set("#hamburgerMenu", {
    display: "block",
  });
  return animation;
}

function contact2Appear() {
  let animation = gsap.timeline();
  animation
    .add(fl_contact_goback(false))
    .set(".contact-us-two-options", {
      autoAlpha: 0,
    })
    .to(".contact-us-two-options", {
      delay: 3,
      duration: 0.1,
      translateY: "-800vh",
    })
    .to(["#fl-back", ".contact-us-two-options"], {
      duration: 1,
      autoAlpha: 1,
      ease: "slow(0.7, 0.1, false)",
    })
    .to(
      ".path",
      {
        duration: 2,
        "stroke-dashoffset": 0,
      },
      "-=2"
    )
    .to("#rectglow feDropShadow", {
      duration: 1,
      attr: { stdDeviation: 2 },
      repeat: -1,
      yoyo: true,
    });
  return animation;
}
function contact2Disappear() {
  let animation = gsap.timeline();
  animation
    .set("#rectglow feDropShadow", {
      attr: { stdDeviation: 0 },
    })
    .to(".path", {
      duration: 2,
      "stroke-dashoffset": 1000,
    })
    .add(fl_goback_contact(false), "-=2")
    .to(
      ".contact-us-two-options",
      {
        duration: 1,
        autoAlpha: 0,
        ease: "power2.out",
      },
      "-=1"
    )
    .to(".contact-us-two-options", {
      duration: 0.1,
      translateY: "800vh",
    })
    .to("#fl-contact", {
      duration: 1,
      autoAlpha: 1,
    });
  animation.set("#hamburgerMenu", {
    display: "block",
  });
  return animation;
}

function flameDescDisappear(type) {
  let animation = gsap.timeline();
  animation
    .flame(ID_index[type].flame, { time: 2 })
    .to(
      ID_index[type].description,
      {
        duration: 1,
        autoAlpha: 1,
      },
      "-=3"
    )
    .to(ID_index[type].description, {
      duration: 1,
      autoAlpha: 0,
    });
  return animation;
}

// floating-logo change
function fl_contact_goback(threeAnim = true) {
  let anim = gsap.timeline();

  anim.set("#fl-back", {
    autoAlpha: 0,
  });
  if (threeAnim) {
    // anim.to('#fl-contact', {
    // 	duration: 1,
    // 	autoAlpha: 0,
    // 	ease: 'slow(0.7, 0.1, false)',
    // 	onStart: mark_forward, // 1.2s
    // });
    anim.to("#fl-contact", {
      duration: 1,
      autoAlpha: 0,
      ease: "slow(0.7, 0.1, false)",
    });
    anim.set("#hamburgerMenu", {
      display: "none",
    });

    if (isPortrait()) {
      anim.to(
        "#flashingLogoCopy",
        {
          duration: 1.7,
          autoAlpha: 1,
          translateX: "46vw",
          translateY: "25vh",
          scaleX: 10,
          scaleY: 10,
          rotationY: 360,
          ease: "slow(0.7, 0.1, false)",
        },
        "-=0.5"
      );
    } else {
      anim.to(
        "#flashingLogoCopy",
        {
          duration: 1.7,
          autoAlpha: 1,
          translateX: "26vw",
          translateY: "32vh",
          scaleX: 7,
          scaleY: 7,
          rotationY: 360,
          ease: "slow(0.7, 0.1, false)",
        },
        "-=0.5"
      );
    }
  } else {
    anim.to("#fl-contact", {
      duration: 1,
      autoAlpha: 0,
      ease: "slow(0.7, 0.1, false)",
    });
    anim.set("#hamburgerMenu", {
      display: "none",
    });
  }

  anim
    .to("#fl-contact", {
      duration: 0.1,
      translateY: "200vh",
    })
    .to(
      "#fl-back",
      {
        duration: 0.1,
        translateY: "-300vh",
      },
      "-=0.1"
    );
  return anim;
}
function fl_goback_contact(threeAnim = true) {
  let anim = gsap.timeline();
  if (threeAnim) {
    // anim.to('#fl-back', {
    // 	duration: 1,
    // 	autoAlpha: 0,
    // 	ease: 'slow(0.7, 0.1, false)',
    // 	onStart: mark_backward, // 1.2s
    // });
    anim.to("#fl-back", {
      duration: 1,
      autoAlpha: 0,
      ease: "slow(0.7, 0.1, false)",
    });
    if (isPortrait()) {
      anim.to(
        "#flashingLogoCopy",
        {
          duration: 1.7,
          autoAlpha: 0,
          translateX: "0",
          translateY: "0",
          scaleX: 1,
          scaleY: 1,
          rotationY: 0,
          ease: "slow(0.7, 0.1, false)",
        },
        "-=0.5"
      );
    } else {
      anim.to(
        "#flashingLogoCopy",
        {
          duration: 1.7,
          autoAlpha: 0,
          translateX: "0",
          translateY: "0",
          scaleX: 1,
          scaleY: 1,
          rotationY: 0,
          ease: "slow(0.7, 0.1, false)",
        },
        "-=0.5"
      );
    }
  } else {
    anim.to("#fl-back", {
      duration: 1,
      autoAlpha: 0,
      ease: "slow(0.7, 0.1, false)",
    });
  }
  anim
    .to("#fl-back", {
      duration: 0.1,
      translateY: "300vh",
    })
    .to(
      "#fl-contact",
      {
        duration: 0.1,
        translateY: "-200vh",
      },
      "-=0.1"
    );
  return anim;
}

function mainPg_contact3() {
  let animation = gsap.timeline();
  animation.add(mainPgContentsDisappear()).add(contact3Appear());
  return animation;
}

function contact3_mainPg() {
  let animation = gsap.timeline();
  animation.add(contact3Disappear());
  animation.call(mainPgContentsAppear, null, "-=0.1");
  return animation;
}

function mainPg_detailPg(type) {
  let animation = gsap.timeline();
  if (isMobile()) {
    animation.add(flameDescDisappear(type));
  } else {
    // animation.call(mouseOut, type);
    // animation.add(flameDescDisappear(type));
  }
  animation
    .add(mainPgContentsDisappear())
    .call(ID_index[type].threeDAnimation[0])
    .add(detailPgAppear(type));
  return animation;
}

function detailPg_mainPg(type) {
  let animation = gsap.timeline();
  animation.add(detailPgDisappear(type)).call(ID_index[type].threeDAnimation[1]);
  animation.call(mainPgContentsAppear, null, "+=6");
  return animation;
}

function detailPg_contact3(type) {
  let animation = gsap.timeline();
  animation.add(detailPgDisappear(type)).add(contact3Appear());
  return animation;
}
function contact3_DetailPg(type) {
  let animation = gsap.timeline();
  animation.add(contact3Disappear());
  animation.add(detailPgAppear(type), "-=6.5");
  return animation;
}

function detailPg_contact2(type) {
  let animation = gsap.timeline();
  animation
    .add(detailPgDisappear(type))
    .call(ID_index[type].threeDAnimTop[0])
    .add(contact2Appear());

  return animation;
}

function contact2_mainPg() {
  let animation = gsap.timeline();
  animation
    .set("#rectglow feDropShadow", {
      attr: { stdDeviation: 0 },
    })
    .to(".path", {
      duration: 2,
      "stroke-dashoffset": 1000,
    })
    .add(fl_goback_contact(false), "-=2")
    .to(".contact-us-two-options", {
      duration: 1,
      autoAlpha: 0,
      ease: "power2.out",
      // onComplete: anim_down, // 1.2
    })
    .add(anim_down)
    .to(".contact-us-two-options", {
      duration: 0.1,
      translateY: "800vh",
    });
  animation.call(mainPgContentsAppear, null, "+=3"); // 1.2
  animation.to(
    "#fl-contact",
    {
      duration: 1,
      autoAlpha: 1,
    },
    "-=1"
  );
  animation.set("#hamburgerMenu", {
    display: "block",
  });
  return animation;
}
function contact2_detailPg(type) {
  let animation = gsap.timeline();
  animation
    .add(contact2Disappear())
    .call(ID_index[type].threeDAnimTop[1])
    .add(detailPgAppear(type), "-=2");
  return animation;
}

// disable & enable pointer-events function
const pointer = function (time) {
  $(".logo, .floating-logo, .backBtns, .mainContent-title, .getStarted, #hamburgerMenu").css(
    "pointer-events",
    "none"
  );
  setTimeout(function () {
    // enable click after 'time' seconds
    $(".logo, .floating-logo, .backBtns, .mainContent-title, .getStarted, #hamburgerMenu").css(
      "pointer-events",
      "auto"
    );
  }, time); // 'time' seconds delay
};

// reset index page
if (sessionStorage.getItem("cameraPos") !== null) {
  master.add(logoWelcomeThreeD(true)).add(flashingLogoAppear());
} else {
  master
    .add(logoWelcomeThreeD(false))
    .add(flashingLogoAppear())
    .add(mainPgContentsAppear(), "+=15");
}

// goto3d
$(function () {
  // loading from other pages
  if (sessionStorage.getItem("cameraPos") !== null) {
    master.seek(12);

    // restore camera state
    let camPos = JSON.parse(sessionStorage.getItem("cameraPos"));
    let camRot = JSON.parse(sessionStorage.getItem("cameraRot"));
    camera.position.set(...Object.values(camPos));
    camera.rotation.set(...Object.values(camRot));
    ground.visible = false;
    ground1.visible = true;

    // restore left page state
    let leftPageType = JSON.parse(sessionStorage.getItem("leavePageType"));
    if (leftPageType == "main") {
      mainPgContentsAppear();
    } else {
      detailPgAppear(leftPageType);
    }

    sessionStorage.clear();
  }
  // original loading
  else {
    pointer(34000);
  }
});

//////////////////////////////////
/* click events implementation  */
//////////////////////////////////
var detailPgType = "";
var contactType = "";
const types = ["content", "client", "candidates"];

// from 'mainContent' to 'detailPage'
$(".logo, .mainContent-title").on("click", (e) => {
  const targetId = String(e.target.closest(".contents").id).slice(5);
  mainPg_detailPg(targetId);
  pointer(ID_index[targetId].animDelay[0]);
});

// from 'detailPg' back to 'mainContent'
$(".backBtns").on("click", (e) => {
  const targetId = String(e.target.closest("button").id).slice(0, -4);
  detailPg_mainPg(targetId);
  pointer(ID_index[targetId].animDelay[1]);
});

// from main & detail page to contact3 one
$("#fl-contact").on("click", () => {
  let coordY = Object.keys(ID_index).map((el) => {
    return parseInt(
      $(ID_index[el].detailPg)
        .css("transform")
        .replace(/[^0-9\-.,]/g, "")
        .split(",")[5]
    );
  });
  let type = types[coordY.findIndex((el) => el < 0)];
  if (type !== undefined) {
    // if (type === "candidates") {
    //   $("#c3emailAddr").text(" disrupt@fitzgrp.com");
    // }
    detailPg_contact3(type);
    pointer(_conts_contact3);
    detailPgType = type;
  } else {
    mainPg_contact3();
    pointer(_conts_contact3);
    detailPgType = "main";
  }
  contactType = "contact3";
});

// from 'Contact Us' to 'contents' page
$("#fl-back").on("click", () => {
  if (contactType === "contact2") {
    if (detailPgType == "candidates") {
      setTimeout(() => {
        $("#c2emailAddr").text(" info@fitzgrp.com");
      }, 3000);
    }
    contact2_detailPg(detailPgType);
    pointer(_contact2_conts);
  } else if (contactType === "contact3") {
    if (detailPgType === "main") {
      contact3_mainPg();
      pointer(_contact3_conts);
    } else {
      if (detailPgType == "candidates") {
        setTimeout(() => {
          $("#c3emailAddr").text(" info@fitzgrp.com");
        }, 3000);
      }
      contact3_DetailPg(detailPgType);
      pointer(_contact3_conts);
    }
  }

  detailPgType = "";
  contactType = "";
});

// from detailPg to contact2(top of pillar) page
$(".getStarted").on("click", () => {
  let coordY = Object.keys(ID_index).map((el) => {
    return parseInt(
      $(ID_index[el].detailPg)
        .css("transform")
        .replace(/[^0-9\-.,]/g, "")
        .split(",")[5]
    );
  });
  let type = types[coordY.findIndex((el) => el < 0)];
  if (type == "candidates") {
    $("#c2emailAddr").text(" disrupt@fitzgrp.com");
  }
  detailPg_contact2(type);
  pointer(_conts_contact2);
  detailPgType = type;
  contactType = "contact2";
});

// hover implementation
let flameEffect;
// flame and glow effect infinite loop stop and resume
$(".logo, .mainContent-title").on("mouseover", (e) => {
  const targetId = String(e.target.closest(".contents").id).slice(5);
  if (!isMobile()) {
    flameEffect = gsap.timeline().flame(ID_index[targetId].flame, { time: -1 });
    flameEffect.play();
    gsap.to(ID_index[targetId].description, {
      duration: 0.5,
      autoAlpha: 1,
    });
  }
});
const mouseOut = (targetId) => {
  flameEffect.clear();
  gsap.set(ID_index[targetId].flame, { autoAlpha: 0 });
  gsap.to(ID_index[targetId].description, {
    duration: 0.5,
    autoAlpha: 0,
  });
};
$(".logo, .mainContent-title").on("mouseout", (e) => {
  if (!isMobile()) {
    const targetId = String(e.target.closest(".contents").id).slice(5);

    mouseOut(targetId);
  }
});

///////////////////////////////////////////////////////
/* iPhone5/SE, iPad, iPadPro screen orientation lock */
///////////////////////////////////////////////////////
$(function () {
  if (isMobile()) {
    const isiPhone5 = window.matchMedia(
      "only screen and (min-device-width: 320px) and (max-device-width: 568px) and (device-aspect-ratio: 40/71)"
    ).matches;
    if (isiPhone5) {
      screen.orientation.lock("portrait");
    }

    const isiPad = window.matchMedia(
      "only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (device-aspect-ratio: 3/4)"
    ).matches;
    if (isiPad) {
      screen.orientation.lock("landscape");
    }
    const isiPadPro = window.matchMedia(
      "only screen and(min - width: 1024px) and(max - height: 1366px) and(-webkit - min - device - pixel - ratio: 1.5)"
    ).matches;

    if (isiPadPro) {
      screen.orientation.lock("landscape");
    }

    setInterval(() => {
      let pos = $("#flashingLogoCopy").position();
      let transform = _getTransform($("#flashingLogoCopy"));

      if (pos.left > 0 && pos.top > 0) {
        if (isPortrait() && transform.rotateX == -0 && transform.rotateY == -0) {
          gsap.to("#flashingLogoCopy", {
            duration: 0.01,
            translateX: "46vw",
            translateY: "25vh",
            scaleX: 10,
            scaleY: 10,
          });
        } else if (!isPortrait() && transform.rotateX == -0 && transform.rotateY == -0) {
          gsap.to("#flashingLogoCopy", {
            duration: 0.01,
            translateX: "26vw",
            translateY: "32vh",
            scaleX: 7,
            scaleY: 7,
          });
        }
      }
    }, 1000);
  }

  // Set button to click.
  const button = document.getElementById("menu-toggle");

  // Click the button.
  button.onclick = function () {
    // Toggle class "opened". Set also aria-expanded to true or false.
    if (-1 !== button.className.indexOf("opened")) {
      button.className = button.className.replace(" opened", "");
      button.setAttribute("aria-expanded", "false");
    } else {
      button.className += " opened";
      button.setAttribute("aria-expanded", "true");
    }
  };
});

// get transform rotation of element
const _getTransform = function ($element) {
  let matrix = $element.css("transform"),
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0;

  if (matrix !== "none") {
    // do some magic
    let values = matrix.split("(")[1].split(")")[0].split(","),
      pi = Math.PI,
      sinB = parseFloat(values[8]),
      b = Math.round((Math.asin(sinB) * 180) / pi),
      cosB = Math.cos((b * pi) / 180),
      matrixVal10 = parseFloat(values[9]),
      a = Math.round((Math.asin(-matrixVal10 / cosB) * 180) / pi),
      matrixVal1 = parseFloat(values[0]),
      c = Math.round((Math.acos(matrixVal1 / cosB) * 180) / pi);

    rotateX = a;
    rotateY = b;
    rotateZ = c;
  }

  return {
    rotateX: rotateX,
    rotateY: rotateY,
    rotateZ: rotateZ,
  };
};

// overlay effect
function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
  if (document.getElementById("hmCheck").checked) {
    document.getElementById("hmCheck").checked = false;
  }
}

function toggleOverlay() {
  let ele = document.getElementById("hmCheck");
  if (ele.checked) {
    on();
  } else {
    off();
  }
}

var cameraPos, cameraRot;
// save camera & page state to sessionStorage when leaving 'index' page
function getCameraState() {
  // todo
  cameraPos = camera.position;
  cameraRot = camera.rotation;
  sessionStorage.setItem("cameraPos", JSON.stringify(cameraPos));
  sessionStorage.setItem("cameraRot", JSON.stringify(cameraRot));
  off();

  // get leaving page info
  let leavePageType = "";
  let coordY = Object.keys(ID_index).map((el) => {
    return parseInt(
      $(ID_index[el].detailPg)
        .css("transform")
        .replace(/[^0-9\-.,]/g, "")
        .split(",")[5]
    );
  });
  let type = types[coordY.findIndex((el) => el < 0)];
  if (type !== undefined) {
    leavePageType = type;
  } else {
    leavePageType = "main";
  }
  sessionStorage.setItem("leavePageType", JSON.stringify(leavePageType));
}

// appear message contact form
function toggleMsgForm() {
  document.getElementById("overlayContactMsgForm").style.display = "flex";
}

// disappear the overlay contact message form
function offContactMsgForm() {
  document.getElementById("contactMsgForm").reset();
  document.querySelectorAll(".btn-hide-validate").forEach((node) => {
    node.remove();
  });
  document.querySelectorAll(".wrap-input100").forEach((node) => {
    node.classList.remove("true-validate");
    node.classList.remove("alert-validate");
  });
  document.getElementById("overlayContactMsgForm").style.display = "none";
}

// the event being fired when the submit btn 'send now' is clicked
function formSubmit() {
  const inputs = $(".validate-input .input100");

  let check = true;

  // show the result of input value check
  function showValidate(input) {
    const thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");

    $(thisAlert).append('<span class="btn-hide-validate">&#xf136;</span>');
    $(".btn-hide-validate").each(function () {
      $(this).on("click", function () {
        hideValidate(this);
      });
    });
  }

  function hideValidate(input) {
    const thisAlert = $(input).parent();
    $(thisAlert).removeClass("alert-validate");
    $(thisAlert).find(".btn-hide-validate").remove();
  }

  // check if the input value conforms to the rule
  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else if ($(input).attr("type") == "phone" || $(input).attr("name") == "phone") {
      if (
        $(input)
          .val()
          .trim()
          .match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/) == null
      ) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  for (let i = 0; i < inputs.length; i++) {
    if (validate(inputs[i]) == false) {
      showValidate(inputs[i]);
      check = false;
    }
  }

  if (check) {
    //_____ using ajax post  _______//
    let data = objectifyForm($("#contactMsgForm").serializeArray());
    data.toEmail = "info@fitzgrp.com";

    console.log("form data:", data);

    // ajax send form data
    sendFormData(data);
  } else {
    alert("Please fill in the form");
  }
}

//
function objectifyForm(formArray) {
  //serialize data function
  let returnArray = {};
  for (let i = 0; i < formArray.length; i++) {
    returnArray[formArray[i]["name"]] = formArray[i]["value"];
  }
  return returnArray;
}

// send form data through ajax
function sendFormData(data) {
  // send ajax
  $.ajax({
    url: "email-script.php", // url where to submit the request
    type: "POST", // type of action POST || GET
    data: data, // post data || get data
    success: function (result) {
      // you can see the result from the console
      // tab of the developer tools

      alert("Thanks for contacting us! We'll reach out to you shortly.");

      // remove the contact message form
      offContactMsgForm();

      // go back button click simulation
      $("#fl-back").click();
    },
    error: function (xhr, resp, text) {
      console.log("xhr:", xhr, "resp:", resp, "text: ", text);
    },
  });
}

const isNumericInput = (event) => {
  const key = event.keyCode;
  return (
    (key >= 48 && key <= 57) || // Allow number line
    (key >= 96 && key <= 105) // Allow number pad
  );
};

const isModifierKey = (event) => {
  const key = event.keyCode;
  return (
    event.shiftKey === true ||
    key === 35 ||
    key === 36 || // Allow Shift, Home, End
    key === 8 ||
    key === 9 ||
    key === 13 ||
    key === 46 || // Allow Backspace, Tab, Enter, Delete
    (key > 36 && key < 41) || // Allow left, up, right, down
    // Allow Ctrl/Command + A,C,V,X,Z
    ((event.ctrlKey === true || event.metaKey === true) &&
      (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
  );
};

const enforceFormat = (event) => {
  // Input must be of a valid number format or a modifier key, and not longer than ten digits
  if (!isNumericInput(event) && !isModifierKey(event)) {
    event.preventDefault();
  }
};

const formatToPhone = (event) => {
  if (isModifierKey(event)) {
    return;
  }

  // I am lazy and don't like to type things more than once
  const target = event.target;
  const input = target.value.replace(/\D/g, "").substring(0, 10); // First ten digits of input only
  const areaCode = input.substring(0, 3);
  const middle = input.substring(3, 6);
  const last = input.substring(6, 10);

  if (input.length > 6) {
    target.value = `(${areaCode}) ${middle}-${last}`;
  } else if (input.length > 3) {
    target.value = `(${areaCode}) ${middle}`;
  } else if (input.length > 0) {
    target.value = `(${areaCode}`;
  }
};

const inputElement = document.getElementById("phone");
inputElement.addEventListener("keydown", enforceFormat);
inputElement.addEventListener("keyup", formatToPhone);

// pdf download button
$(".pdf-button").click(function () {
  const title = this.innerText.replace(/^\s+|\s+$/g, "");
  switch (title) {
    case "Clown Shoes":
      downloadPDF("Clown Shoes.pdf");
      break;
    case "Both Sides of Their Mouth":
      downloadPDF("Both Sides Their Mouth.pdf");
      break;
    case "Doing It Wrong":
      downloadPDF("Doing It Wrong.pdf");
      break;
    case "Mt. Everest":
      downloadPDF("Mt. Everest.pdf");
      break;
    case "Contract":
      downloadPDF("Contract.pdf");
      break;
    case "Training":
      downloadPDF("Training.pdf");
      break;
    case "Culture":
      downloadPDF("Culture.pdf");
      break;
  }
});

const downloadPDF = (filename) => {
  const link = document.createElement("a");
  let docURL = document.URL;
  if (docURL.includes("index.html")) {
    docURL = docURL.slice(0, -11);
  }
  link.href = `${docURL}/res/pdf/${filename}`;
  link.target = "_blank";
  // link.download = filename;
  link.dispatchEvent(new MouseEvent("click"));
  link.remove();
};
