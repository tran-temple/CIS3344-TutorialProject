function MakeVideoLightBox(params) {
    // the variable to store the selected image
    var slideIndex = 1;

    // validate that you have what you need in the params object
    if (!params) {
        alert("Must pass in a parameter object to MakeVideoLightBox");
        return;
    }

    if (!params.id || !document.getElementById(params.id)) {
        alert("Parameter object must have an 'id' property that references a valid DOM object");
        return;
    }

    // ********************** ajax *************************************   
    // Make an ajax call to the given url, then if the call was successful, 
    // call the Success Callback fn, otherwise, set an error message into the 
    // DOM element that has id 'errorId'.
    function ajax(url, callBackSuccess, errorId) {

        // The httpReq Object is now local to function "ajaxCall" (not global)
        var httpReq;
        if (window.XMLHttpRequest) {
            httpReq = new XMLHttpRequest(); //For Firefox, Safari, Opera
        } else if (window.ActiveXObject) {
            httpReq = new ActiveXObject("Microsoft.XMLHTTP"); //For IE 5+
        } else {
            alert('ajax not supported');
        }

        console.log("ready to get content " + url);
        httpReq.open("GET", url); // specify which page you want to get

        // Ajax calls are asyncrhonous (non-blocking). Specify the code that you 
        // want to run when the response (to the http request) is available. 
        httpReq.onreadystatechange = callBack;
        httpReq.send(null); // initiate ajax call

        function callBack() { // the browser will invoke this function when the data is ready

            // readyState == 4 means that the http request is complete
            if (httpReq.readyState === 4) {
                if (httpReq.status === 200) {
                    var jsonString = httpReq.responseText;
                    var obj = JSON.parse(jsonString);
                    callBackSuccess(obj);
                } else {
                    // First use of property creates new (custom) property
                    document.getElementById(errorId).innerHTML = "Error (" + httpReq.status + " " + httpReq.statusText +
                            ") while attempting to read '" + url + "'";
                }
            }
        }

    } // end function ajax

    // Define variables from the params object
    var videoContainer = document.getElementById(params.id);
    var videoURL = params.videoFile;
    var videoType = params.videoType;
    var titleVideo = params.videoTitle;
    var introModal = params.modalIntro;
    var jsonURL = params.jsonFile;

    // invoke ajax function to read json and if the call was successful, 
    // run function processJSON, otherwise, put an error message in the DOM element 
    // that has id get from params object.
    ajax(jsonURL, processData, videoContainer);

    // Create a video element and add video
    var video = document.createElement("video");
    video.className = "myVideo";
    video.src = videoURL;
    video.type = videoType;
    video.autoplay = "autoplay";
    video.muted = "muted";
    video.loop = "loop";
    videoContainer.appendChild(video);

    // Create the VideoMessage div and append message for video, message for Modal Image Gallery,
    // the image set and the modal image gallery
    var mainContent = document.createElement("div");
    mainContent.className = "videolightbox";

    // Generate title for video
    var headingVideo = document.createElement("h3");
    headingVideo.innerHTML = titleVideo;
    mainContent.appendChild(headingVideo);

    // generate the button to play / pause video
    var btnVideo = document.createElement("button");
    btnVideo.className = "buttonVideo";
    btnVideo.innerHTML = "Pause";
    // click on the Video button to play/pause
    btnVideo.onclick = function () {
        if (video.paused) {
            video.play();
            btnVideo.innerHTML = "Pause";
        } else {
            video.pause();
            btnVideo.innerHTML = "Play";
        }
    };
    mainContent.appendChild(btnVideo);

    // Generate introduction for modal
    var messageModal = document.createElement("div");
    messageModal.className = "modalMessage";
    var pIntro = document.createElement("p");
    pIntro.innerHTML = introModal;
    messageModal.appendChild(pIntro);

    mainContent.appendChild(messageModal);

    // Process data read from JSon
    function processData(list) {
        console.log(list);  // list is an array of objects        

        // Generate the set of image
        var imageSetContainer = document.createElement("div");
        imageSetContainer.className = "imageSet";

        // Generate the Modal Image Gallery
        var modalContainer = document.createElement("div");
        modalContainer.className = "modal";

        // Generate detailed HTML for the image set
        for (var i = 0; i < list.length; i++) {
            var imageDiv = document.createElement("div");
            imageDiv.className = "column";
            var imageSmall = document.createElement("img");
            imageSmall.src = list[i].ImageSmall;
            imageSmall.alt = list[i].Alt;
            imageSmall.className = "hover-shadow cursor";
            imageSmall.setAttribute("data-index", i + 1);
            // click on the image on the background to open modal
            imageSmall.onclick = function () {
                openModal(modalContainer);
                currentSlide(modalContainer, this.getAttribute('data-index'));
            };

            imageDiv.appendChild(imageSmall);
            imageSetContainer.appendChild(imageDiv);
        }

        // Generate detailed HTML for the Modal Image Gallery
        var close = document.createElement("span");
        close.innerHTML = "&times";
        close.className = "close cursor";

        // generate close modal
        close.onclick = function () {
            closeModal(modalContainer);
        };
        modalContainer.appendChild(close);

        // generate the modal content
        var modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // generate the wide image
        for (var i = 0; i < list.length; i++) {
            var imageDiv = document.createElement("div");
            imageDiv.className = "mySlides";
            var numbertextDiv = document.createElement("div");
            numbertextDiv.className = "numbertext";
            numbertextDiv.innerHTML = (i + 1) + " / " + (list.length);
            var imageWide = document.createElement("img");
            imageWide.src = list[i].ImageWide;
            imageWide.alt = list[i].Alt;

            imageDiv.appendChild(numbertextDiv);
            imageDiv.appendChild(imageWide);
            modalContent.appendChild(imageDiv);
        }

        // generate prev & next navigation, and caption        
        var previous = document.createElement("a");
        previous.className = "prev";
        previous.innerHTML = "&#10094;";
        //navigate to the previous image
        previous.onclick = function () {
            plusSlides(modalContainer, -1);
        };
        modalContent.appendChild(previous);
        var next = document.createElement("a");
        next.className = "next";
        next.innerHTML = "&#10095;";
        // navigate to the next image
        next.onclick = function () {
            plusSlides(modalContainer, 1);
        };
        modalContent.appendChild(next);
        var captionContainer = document.createElement("div");
        captionContainer.className = "caption-container";
        var caption = document.createElement("p");
        caption.className = "caption";
        captionContainer.appendChild(caption);
        modalContent.appendChild(captionContainer);

        // generate the bottom images of modal
        for (var i = 0; i < list.length; i++) {
            var imageDiv = document.createElement("div");
            imageDiv.className = "column";
            var imageWide = document.createElement("img");
            imageWide.src = list[i].ImageWide;
            imageWide.alt = list[i].Alt;
            imageWide.className = "demo cursor";
            imageWide.setAttribute("data-index", i + 1);
            imageWide.onclick = function () {
                currentSlide(modalContainer, this.getAttribute('data-index'));
            };
            imageDiv.appendChild(imageWide);
            modalContent.appendChild(imageDiv);
        }

        modalContainer.appendChild(modalContent);

        mainContent.appendChild(imageSetContainer);
        mainContent.appendChild(modalContainer);

    }

    videoContainer.appendChild(mainContent);

    //The private methods for showing the modal and navigating the image gallery
    function openModal(myModal) {
        myModal.style.display = "block";
    }

    function closeModal(myModal) {
        myModal.style.display = "none";
    }

    function plusSlides(myModal, n) {
        showSlides(myModal, slideIndex += n);
    }

    function currentSlide(myModal, n) {
        // n may be string, 
        // convert n to number by using +n to make sure slideIndex type is always number
        showSlides(myModal, slideIndex = +n);
    }

    function showSlides(myModal, n) {

        var i;
        var slides = myModal.getElementsByClassName("mySlides");
        var dots = myModal.getElementsByClassName("demo");
        var captionText = myModal.getElementsByClassName("caption")[0];
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
        captionText.innerHTML = dots[slideIndex - 1].alt;
    }

    // Public methods
    videoContainer.setTextColor = function (color) {
        var videoLigthbox = videoContainer.getElementsByClassName("videolightbox")[0];
        videoLigthbox.style.color = color;
    };

    return videoContainer;
}

