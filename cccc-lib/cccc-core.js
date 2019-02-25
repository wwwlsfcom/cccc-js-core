(function () {
    let obj = {}
    obj.isArray = function (argu) {
        let result = typeof argu != 'undefined';
        result = result && argu;
        result = result && argu instanceof Array;
        return result === true;
    }
    obj.isUndefined = function (argu) {
        return (typeof argu == 'undefined') === true;
    }
    obj.isNull = function (argu) {
        return obj.isUndefined(argu) || argu == null;
    }
    obj.isNotNull = function (argu) {
        return !obj.isNull(argu);
    }
    /*
 * 判断为空字符串
 */
    obj.isEmpty = function (str) {
        return obj.isNull(str) || str == "";
    }
    obj.isFunction = function (argu) {
        return obj.isNotNull(argu) && argu instanceof Function
    }
    /**
     * 判断是否为IE浏览器
     * @return {boolean}
     */
    obj.isIE = function () {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 获取http url后面的查询参数
     */
    obj.getReqParameter = function (key) {
        var re = new RegExp(key + '=([^&]*)(?:&)?');
        var url = window.location.href;
        return url.match(re) && url.match(re)[1];
    }

    /**
     * 格式化字符串
     * @param str: 包含占位符{n}的字符串
     * @param str之后的参数列表中为替换占位符的值
     * 举例 :   cccc.format('{1} hellow {0} ', 'world' , 'xiaoming'), 格式化结果:  xiaoming hello world
     */
    obj.format = function (str) {
        let result = str
        for (let index = 1; index < arguments.length; index++) {
            let regex = new RegExp('\\{' + (index - 1) + '\\}', 'g')
            result = result.replace(regex, arguments[index])
        }
        return result
    }

    obj.formatNumber = function (num) {
        return (100 + num + '').substring(1)
    }

    obj.formatDate = function (date) {
        if (date instanceof Date) {
            let now = date
            let y = now.getFullYear()
            let m = obj.formatNumber(now.getMonth() + 1)
            let d = obj.formatNumber(now.getDate())
            let h = obj.formatNumber(now.getHours())
            let minute = obj.formatNumber(now.getMinutes())
            let sec = obj.formatNumber(now.getSeconds())
            let datestr = cccc.format('{0}-{1}-{2}', y, m, d)
            return datestr
        }
    }

    obj.formatDateTime = function (date) {
        if (date instanceof Date) {
            let now = date
            let h = obj.formatNumber(now.getHours())
            let minute = obj.formatNumber(now.getMinutes())
            let sec = obj.formatNumber(now.getSeconds())
            let timeStr = cccc.format('{0}:{1}:{2}', h, minute, sec)
            let dataStr = obj.formatDate(now)
            return dataStr + ' ' + timeStr
        } else
            return ''
    }

//如果是IE浏览器
    if (obj.isIE()) {
        Object.assign = function (target, source) {
            for (var item in source) {
                target[item] = source[item]
            }
        }
    }

    function resizeWidth(e) {
        pauseEvent(e);
        if (e.buttons == 1) {
            let offset = e.clientX - document.active_resizing_target.last_pos_x
            document.active_resizing_target.style.width = document.active_resizing_target.clientWidth + offset + "px"
            document.active_resizing_target.last_pos_x = e.clientX
        }
    }

    function resizeHeight(e) {
        pauseEvent(e);
        if (e.buttons == 1) {
            let offset = e.clientY - document.active_resizing_target.last_pos_y
            document.active_resizing_target.style.height = document.active_resizing_target.clientHeight + offset + "px"
            document.active_resizing_target.last_pos_y = e.clientY
        }
    }

    let movelistener = {
        handleEvent: function (e) {
            pauseEvent(e);
        }
    }

    /**
     * 阻止事件冒泡
     * 不仅仅要stopPropagation，还要preventDefault
     * @param e
     * @return {boolean}
     */
    function pauseEvent(e) {
        //在事件中
        e = e || window.event;
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return e;
    }

    obj.enableResize = function (targetElement) {
        if (obj.isNull(targetElement))
            return
        targetElement.className = typeof targetElement.className == 'undefined' || !targetElement.className ? 'enable-resizable' : targetElement.className + '  ' + 'enable-resizable'
        let rightSide = document.createElement('div')
        rightSide.className = 'right-side'
        targetElement.appendChild(rightSide)
        document.addEventListener('mousemove', movelistener)
        rightSide.addEventListener('mousedown', function (e) {
            pauseEvent(e);
            document.active_resizing_target = targetElement
            document.active_resizing_target.last_pos_x = e.clientX
            movelistener.handleEvent = resizeWidth
        })
        let bottomSide = document.createElement('div')
        bottomSide.className = 'bottom-side'
        targetElement.appendChild(bottomSide)
        bottomSide.addEventListener('mousedown', function (e) {
            pauseEvent(e);
            document.active_resizing_target = targetElement
            document.active_resizing_target.last_pos_y = e.clientY
            movelistener.handleEvent = resizeHeight
        })
        let thumb = document.createElement('div')
        thumb.className = 'thumb'
        targetElement.appendChild(thumb)
        thumb.addEventListener('mousedown', function (e) {
            pauseEvent(e);
            document.active_resizing_target = targetElement
            document.active_resizing_target.last_pos_y = e.clientY
            document.active_resizing_target.last_pos_x = e.clientX
            movelistener.handleEvent = function (e) {
                pauseEvent(e);
                resizeHeight(e)
                resizeWidth(e)
            }
        })
        document.addEventListener('mouseup', function (e) {
            pauseEvent(e);
            movelistener.handleEvent = function (e) {
                pauseEvent(e);
            }
        })
    }

    obj.dialog = function (targetElement, title, dialogWrapId) {
        let dialogWrap = document.createElement('div')
        dialogWrap.id = dialogWrapId
        dialogWrap.className = 'cccc-dialog'
        let titlebar = document.createElement('div')
        titlebar.className = 'title-bar'
        let caption = document.createElement('div')
        caption.innerHTML = title
        caption.className = 'caption'
        let closeBtn = document.createElement('span')
        closeBtn.className = 'close'
        titlebar.appendChild(caption)
        titlebar.appendChild(closeBtn)
        dialogWrap.appendChild(titlebar)
        dialogWrap.appendChild(targetElement)
        document.body.appendChild(dialogWrap)

        function mousemoveListener(e) {
            e = pauseEvent(e)
            if (e.buttons == 1) {
                let current_pos = {
                    x: e.clientX,
                    y: e.clientY
                }
                // console.log('this.parentNode.clientLeft = ' + this.parentNode.clientLeft)
                titlebar.parentNode.style.left =
                    titlebar.parentNode.offsetLeft + (current_pos.x - titlebar.last_pos.x) + 'px'
                titlebar.parentNode.style.top =
                    titlebar.parentNode.offsetTop + (current_pos.y - titlebar.last_pos.y) + 'px'
                titlebar.last_pos = current_pos
            }
        }

        titlebar.addEventListener('mousedown', function (e) {
            e = pauseEvent(e)
            this.last_pos = {
                x: e.clientX,
                y: e.clientY
            }
            document.addEventListener('mousemove', mousemoveListener)
        })
        document.addEventListener('mouseup', function (e) {
            e = pauseEvent(e)
            document.removeEventListener('mousemove', mousemoveListener)
        })
        closeBtn.addEventListener('click', function (e) {
            dialogWrap.style.display = 'none'
        })

        return {}
    }

    /**
     * 计算html元素在页面中的绝对边界(相对根元素)
     * @param htmlElement
     */
    obj.getBound = function (htmlElement) {
        let rect = {
            left: $(htmlElement).offset().left, top: $(htmlElement).offset().top,
            width: htmlElement.offsetWidth, height: htmlElement.offsetHeight
        }
        /*        if(htmlElement.tagName.toLowerCase() !== 'html')
                {
                   let outter = obj.getBound($(htmlElement).offsetParent().get(0))
                    rect.left += outter.left
                    rect.top += outter.top
                }*/
        return rect
    }

    if (typeof window.cccc == 'undefined' || obj.isNull(window.cccc))
        window.cccc = {}
    Object.assign(window.cccc, obj)
}());



