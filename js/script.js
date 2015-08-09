/**
 * Created with Sublime Text 2.
 * User: PhuTv.
 */

$(window).on( "pagebeforecreate", function( event ) { 
    $('#loading-indicator').show(); 
} );

$(window).load(function() {
    $('#loading-indicator').hide();
});

$(document).ready(function() {
    // Init tooltip
    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({
        "placement": "bottom",
        delay: {
            show: 400,
            hide: 200
        }
    });

    $(document).ajaxComplete(function(event, request, settings) {

        $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({
            "placement": "bottom",
            delay: {
                show: 400,
                hide: 200
            }
        });

    });
    
    // Settings remove action
    $(document).on('click', '.remove-action', function() {
        notification.custom("Do you want remove this user ?", {
            title: "Warning message",
            titleClass: 'anim warning',
            buttons: [{
                id: 'btn_yes_remove',
                label: 'Yes',
                val: 'Y'
            }, {
                id: 0,
                label: 'No',
                val: 'X'
            }],
            width: '100%'
        });
        var obj_btn = $(this);
        $("#btn_yes_remove").click(function() {
            var item_data = {
                LISTING_ID: $("[name=LISTING_ID]").val(),
                USER_ID: obj_btn.attr('id'),
                ACTION_REQUIRED: 'remove_team_member'
            }
            var data_post = JSON.stringify(item_data);
            var url = APP_BASE_URL + 'my/listing_ajax/ajax_action';
            var res_p = ajax_json(url, data_post);
            var res_json = JSON.parse(res_p);
            if (res_json.success == 1) {
                $('.parent-' + obj_btn.attr('id')).slideUp(function() {
                    $('.parent-' + obj_btn.attr('id')).remove();
                });
                notification.cleanup();
                notification.success(res_json.hc_error_message);
                return false;
            } else {
                notification.error(res_json.hc_error_message);
                return false;

            }
        })
    });

    $('.under-construction').on('click', function(){
        notification.convert ('Notification', 'This feature is under-construction, please check again later.', 'success');
    });

    $('.fc-header-left span.fc-button.fc-button-month').removeClass('edit-unactive');
    $('.fc-header-left span.fc-button.fc-button-month').addClass('edit-active');
});
    
function ajax_check_messages() {
    return $.ajax({
        url: APP_BASE_URL + 'my/messages/ajax_get_messages',
        type: 'POST',
        data: '',
        dataType: 'json',
        cache: false,
        async: false,
        success: function(str) {
            result_data = parseInt(str.data);
            if (result_data > 0) {
                if (str.label == 'notification') {
                    $('#span-notification').html(result_data);
                    $('#li-notification').show();
                    $('.email-top').hide();
                } else {
                    $('#span-message').html(result_data);
                    $('#li-message').show();
                    $('.email-top').show();
                }
            }
        }
    }).responseText;

}

function ajax_loader(arr) {
    return $.ajax({
        url: arr['url'],
        type: 'POST',
        data: arr['data'],
        dataType: arr['datatype'],
        cache: false,
        async: false,
        beforeSend: function(xhr, opts) {
            $('#loading-indicator').show();
        },
        success: function(data) {
            $('#loading-indicator').hide();
            return data;
        },
        error: function(xhr, err) {
            $('#loading-indicator').hide();
            notification.error('ERROR: ' + err);
            return;
        }
    }).responseText;
}

function ajax_json(url, data_post) {
    return $.ajax({
        url: url,
        type: 'POST',
        data: 'data=' + data_post,
        dataType: 'html',
        cache: false,
        async: false,
        beforeSend: function(xhr, opts) {
            $('#loading-indicator').show();
        },
        success: function(data) {
            $('#loading-indicator').hide();
            return data;
        },
        error: function(xhr, err) {
            $('#loading-indicator').hide();
            notification.error('ERROR: ' + err);
            return;
        }
    }).responseText;
}

/* Function script for Calendar*/

// Load data time slot form server
function date_appointment(listing_id, date) {
    var arr = new Array();
    arr['url'] = APP_BASE_URL + 'my/appointment_ajax/ajax_get_appointment';
    arr['data'] = 'LISTING_ID=' + listing_id + '&DATE=' + date;
    arr['datatype'] = 'html';
    var result_m = ajax_loader(arr);
    var result_app = JSON.parse(result_m);
    return result_app;
}

function data_appointment_in_weekly(listing_id, date_in_weekly) {
    var arr = new Array();
    arr['url'] = APP_BASE_URL + 'my/appointment_ajax/ajax_get_appointment_in_weekly';
    arr['data'] = 'LISTING_ID=' + listing_id + '&DATE=' + date_in_weekly;
    arr['datatype'] = 'html';
    var result_m = ajax_loader(arr);
    var result_app = JSON.parse(result_m);
    return result_app;
}

// Parse Date format to Object date
function paser_Date(cur_day) {
    var date = new Object();
    date.weekly = cur_day.getDay();
    date.day = cur_day.getDate();
    date.month = cur_day.getMonth() + 1;
    if (date.month < 10) {
        date.month = "0" + date.month.toString();
    };

    if (date.day < 10) {
        date.day = "0" + date.day.toString();
    };
    date.year = cur_day.getFullYear();
    date.hour = cur_day.getHours();
    date.minutes = cur_day.getMinutes();
    date.second = cur_day.getSeconds();
    if (date.hour < 10) {
        date.hour = "0" + date.hour.toString();
    };

    if (date.minutes < 10) {
        date.minutes = "0" + date.minutes.toString();
    };

    if (date.second < 10) {
        date.second = "0" + date.second.toString();
    };

    date.current_date = date.year + "-" + date.month + "-" + date.day;
    date.current_day = date.day + "-" + date.month + "-" + date.year;
    date.current_m = date.month + "-" + date.day + "-" + date.year;
    date.full_date = date.year + "-" + date.month + "-" + date.day + ' ' + date.hour + ':' + date.minutes + ':' + date.second;
    return date;
}


function removeOldClass(element) {
    for (var i = 1; i <= 5; i++) {
        if ($(element).hasClass(ClassArr[i])) {
            $(element).removeClass(ClassArr[i].toString());
        };
    };
}


function in_array_app_slot(app_data, date) {
    for (var i = 0; i < app_data.length; i++) {
        if (app_data[i].DATETIME_FROM == date) {
            return true;
        }
    };
    return false;
}

function get_id_by_date(object_data, date) {
    if (object_data) {
        for (var i = 0; i < object_data.length; i++) {
            if (object_data[i].start == date) {
                return object_data[i].id;
            };
        };
    };
    return null;
}

function get_slot_unavailable(app_data) {
    var unavailable = [];
    for (var i = 0; i < app_data.length; i++) {
        if (app_data[i].AVAIL_TYPE == 'unavailable') {
            unavailable.push(app_data[i].DATETIME_FROM);
        }
    };
    return unavailable;
}
function get_slot_existtimeslot(app_data) {
    var existtimeslot = [];
    for (var i = 0; i < app_data.length; i++) {
        if (app_data[i].AVAIL_TYPE == 'existtimeslot') {
            existtimeslot.push(app_data[i].DATETIME_FROM);
        }
    };
    return existtimeslot;
}

function get_slot_existtimeslot_app(app_data,date_from,date_to) {
     for (var i = 0; i < app_data.length; i++) {
        if (app_data[i].DATETIME_FROM == date_from && app_data[i].DATETIME_TO == date_to) {
            return app_data[i];
        }
    };
    return false;
}
function in_array_time_unavalable(app_data, date) {
    for (var i = 0; i < app_data.length; i++) {
        if (app_data[i] == date) {
            return true;
        }
    };
    return false;
}

function next_date(example) {
    var date = new Date();
    var parts = example.split('-');
    date.setFullYear(parts[2], parts[0] - 1, parts[1]); // year, month (0-based), day
    date.setTime(date.getTime() + 86400000);
    return date;
}

function prev_date(example) {
    var date = new Date();
    var parts = example.split('-');
    date.setFullYear(parts[2], parts[0] - 1, parts[1]); // year, month (0-based), day
    date.setTime(date.getTime() - 86400000);
    return date;
}

function convert_obj_to_event_object(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].id = data[i].ID;
        var array = data[i].DAY_SLOT.replace(' ', "");
        array = array.replace(' ', "").toString().split(',');
        data[i].start = new Date(array[0], array[1], array[2], 0, 0);
        data[i].end = new Date(array[0], array[1], array[2], 16, 0);
        data[i].className = data[i].STATUS + ' child-node';
        data[i].title = data[i].TITLE;
    };

    return data;
}

function convert_mysql_to_date(mysql_datetime) {
	var tsplit = mysql_datetime.split(/[- :]/);

 	// Apply each element to the Date function
    var date = new Date(tsplit[0], tsplit[1]-1, tsplit[2], tsplit[3], tsplit[4], tsplit[5]);
    return date;
}


function detectIE() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");

    /* If IE, return version number. */
    if (Idx > 0) {
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));

    /* If IE 11 then look for Updated user agent string. */
    } else if (!!navigator.userAgent.match(/Trident\/7\./)) {
        return 11;
    }

    return 0;  /* It is not IE */
}

/**
 * Update char when client input textarea
 * @param obj
 */
function update_char_textarea(obj){
  var count_char = obj.val().length;
  obj.siblings().children('.count_type').html(count_char);
}

// if (document.cookie.indexOf("client_timezone") < 0) {
//     var Cookies = {};
//     Cookies.create = function (name, value, days) {
//         if (days) {
//             var date = new Date();
//             date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//             var expires = "; expires=" + date.toGMTString();
//         } else {
//             var expires = "";
//         }
//         document.cookie = name + "=" + value + expires + "; path=/";
//         this[name] = value;
//     }
//     var tz = jstz.determine();
//     Cookies.create("client_timezone", tz.name(), 1);
// }