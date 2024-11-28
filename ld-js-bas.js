jQuery(document).ready(function($){

    //On click activity
    $( "body" ).on( "click", ".return-rise-button",function(event){
        event.preventDefault();
        let modal = UIkit.modal('.modal-generic-topics-class');
        if (modal) {
            console.log('visible');
            modal.hide();
            $('.modal-generic-topics-class').css('display', 'none');
        }
        $('.cardet-content-here').html('');
    })
    
    //On click activity
    $( "body" ).on( "click", ".cardet-topics-list > li", function(){
        // console.log('clicked');
        $topic_type = $(this).attr('data-topic-type');
        $topic_id = $(this).attr('data-topic-id');
        $topic_link = $(this).attr('data-topic-link');
        $lesson_id = $(this).attr('data-lesson-id');
        
        //Open link in new tab and complete activity.
        if ($topic_type == 'PDF' || $topic_type == 'Word'  || $topic_type == 'PowerPoint'  || $topic_type == 'Link' || $topic_type == 'Video' ) {
            window.open($topic_link, '_blank').focus();
            
            complete_activity($topic_id, $lesson_id);
        }
        else if ($topic_type == 'quiz') {
            UIkit.modal('#'+ $topic_link ).show();
        }
        //Open modal for other activities
        else {
            $('.return-rise-button').removeClass("now-active");
            UIkit.modal('#modal-generic-topics').show();
            $('.cardet-content-here').html('<iframe class="iframe-' + $topic_type +'" src="' + $topic_link +'" style="width:100%;height:100%;"></iframe>');
            //storyline completion
            if ($topic_type == 'Storyline') {
                //Storyline completion
                $('.cardet-modal-spinner').css('opacity','1');
                storyline_load_completion($topic_id, $lesson_id);
            }
            //Storyline end
            
            //rise completion
            if ($topic_type == 'SCORM') {
                //rise completion
                $('.cardet-modal-spinner').css('opacity','1');
                rise_load_completion($topic_id, $lesson_id);
            }
            //rise end
        }
    })
    
    //Complete activity function
    function complete_activity($topic_id, $lesson_id) {
        $('.cardet-modal-spinner').css('opacity','1');
        $('.topics_shortcode').css('opacity','0');
        $.ajax(
        {
            type: "get",
            data: {
                action: 'completeLD',
                topic_id: $topic_id,
                lesson_id: $lesson_id
            },
            dataType: "html",
            url: my_ajax_object.ajax_url,
            complete: function (msg) {
                //UIkit.modal('#modal-generic-topics').hide();
                //console.log(msg.responseText);
                $('.topics_shortcode').html(msg.responseText);
                //$('.cardet-content-here').html('');
                $('.cardet-modal-spinner').css('opacity','0');
                $('.topics_shortcode').css('opacity','1');
                $('.return-rise-button').addClass("now-active");
                if($('.topics_whole_div').length){
                    $('.cardet-lesson-bar').css('display', 'none');
                    $('.topics_whole_div .cardet-lesson-bar').css('display', 'block');
                }
            }
        });
    }
    
    //Storyline completion
    function storyline_load_completion($topic_id, $lesson_id) {
          $(".iframe-Storyline").on("load", function(){
                $('.cardet-modal-spinner').css('opacity','0');
                $(".iframe-Storyline").css('opacity','1');
                //storyline Load
                $(this).contents().on("click","div[data-acc-text*='EXIT'], div[data-acc-text*='exit'], div[data-acc-text*='complete'], div[data-acc-text*='COMPLETE']", function(event){
                event.preventDefault();
                $(".iframe-Storyline").css('opacity','0');
                complete_activity($topic_id, $lesson_id);
                UIkit.modal('#modal-generic-topics').hide();
                $('.cardet-content-here').html('');
                })
            }) 
    }
    
    //RISE completion
    function rise_load_completion($topic_id, $lesson_id) {
        $(".iframe-SCORM").on("load", function(){
        $('.cardet-modal-spinner').css('opacity','0');
        $(".iframe-SCORM").css('opacity','1');
        console.log('load');
        $loltracker = ".nav-sidebar-header";
        $(this).contents().on("DOMSubtreeModified",$loltracker, function(){
	        var a = $(this).html();
		    if (a.includes('100')) {
                $loltracker = "dad";
				 $(".iframe-Rise").css('opacity','0');
                 if($('.topics_whole_div').length){
                    $('.cardet-lesson-bar').css('display', 'none');
                    $('.topics_whole_div .cardet-lesson-bar').css('display', 'block');
                }
				 complete_activity($topic_id, $lesson_id);
		    }
        });
    })
    }
    
    
    //Refresh topics when modal quiz is closed
    // Variable with element that fire event
    var $slideItem = $('.quiz-modals');

    $slideItem.on('hide', function(){
        $('.topics_shortcode').css('opacity','0');
        $('.cardet-modal-spinner').css('opacity','1');
        console.log($lesson_id);
        // console.log($course_id);
        $.ajax(
            {
                type: "get",
                data: {
                    action: 'ajaxtopics',
                    lesson_id: $lesson_id
                },
                dataType: "html",
                url: my_ajax_object.ajax_url,
                complete: function (msg) {
                    //UIkit.modal('#modal-generic-topics').hide();
                    //console.log(msg.responseText);
                    $('.topics_shortcode').html(msg.responseText);
                    //$('.cardet-content-here').html('');
                    $('.cardet-modal-spinner').css('opacity','0');
                    $('.topics_shortcode').css('opacity','1');

                    if($('.topics_whole_div').length){
                        $('.cardet-lesson-bar').css('display', 'none');
                        $('.topics_whole_div .cardet-lesson-bar').css('display', 'block');
                    }

                }
            });
    });
    
})
