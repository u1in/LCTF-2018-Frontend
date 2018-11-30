import { baseURL }  from '../config/config.js';

function ajax_get(url) {
    return new Promise(function (resolve, reject) {
        var XHR = new XMLHttpRequest();
        XHR.withCredentials = true;

        //此函数暂时不能传递带参数的GET请求
        XHR.open('GET', baseURL + url, true);
        XHR.send();

        XHR.onreadystatechange = function () {
            if (XHR.readyState == 4) {
                if (XHR.status == 200) {
                    try {
                        var response = JSON.parse(XHR.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(XHR.statusText));
                }
            }
        }
    })
}  

function ajax_post(url, data) {
    return new Promise(function (resolve, reject) {
        var XHR = new XMLHttpRequest();
        XHR.withCredentials = true;
        XHR.open('POST', baseURL + url, true);
        XHR.setRequestHeader("Content-Type", "application/json");
        XHR.setRequestHeader("X-CSRFToken", localStorage.getItem('token'));
        
        XHR.send(JSON.stringify(data));

        XHR.onreadystatechange = function () {
            if (XHR.readyState == 4) {
                if (XHR.status == 200) {
                    try {
                        var response = JSON.parse(XHR.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(XHR.statusText));
                }
            }
        }
    })
}  

export { ajax_get, ajax_post };