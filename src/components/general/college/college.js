require(['../../common/common.js'], function (common) {
    require(['utils', 'Banner', 'CourseSeries', 'Conference', 'ArticleModel'], function (utils, Banner, CourseSeries, Conference, ArticleModel) {

        var college = {
            channelUrl: "/build/components/general/channelList/ChannelList.html?channelId=",
            channels: {
                video: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 0
                },//课程
                case: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 1
                },//病例
                conference: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 2
                },//会议
                training: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 3
                },//培训
                study: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 4
                }, //进修
                guide: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 5
                },//参考指南
                library: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 6
                },//文库
                news: {
                    container: null,
                    loading: null,
                    hasShow: null,
                    no: 7
                }//咨询

            },
            taskQueue: new Array(8),
            hasInit: null,
            ajaxQueue: [],
            init: function (callback) {
                var _this = this;
                var banner = new Banner("banner-container")
                banner.init();

                var channels_more = _this.storyOpt('get', 'channels_more')
                if (channels_more) {
                    _this.channelsIconSet(channels_more);
                    
                    _this.channelRequest(channels_more, true)
                }
                this.getHomeBanner(function (data) {
                    banner.update(data)
                })
                this.getChannels(function (data) {
                    _this.channelsIconSet(data)

                    _this.channelRequest(data)
                    _this.storyOpt('set', 'channels_more', data)
                });

                window.addEventListener("pageshow", pageInFunction);
                function pageInFunction() {
                    // location.reload();
                    if (channels_more) {
                        _this.channelRequest(channels_more, true)
                    }
                }

                window.onbeforeunload = onbeforeunload_handler;
                function onbeforeunload_handler() {
                    var warning = "确认退出?";
                    _this.ajaxQueue.map((a)=>{
                        if(a.readyState !== 4 && a.status !== 200){
                            a.done()
                        }
                    })
                }
            },
            channelsIconSet: function (data) {
                var imgs = ["wx-hot-news", "wx-video-course", "wx-case-discussion", "wx-train", "wx-reference-guide", "wx-library"];
                var channelArray = new Array(6)
                data.forEach(function (item, index) {
                    var sort = item.sort

                    item.url = college.channelUrl + item.channelId + "&channelName=" + item.channelName;
                    item.img = imgs[sort]

                    channelArray[sort] = item
                })
                $(".college-channels").html(_.template($("#channelIcons").html())({ data: channelArray }))
            },
            channelMoreSet: function (data, isStory) {
                var _this = this;
                var cChannelData = _this.storyOpt('get', 'channels_more')
                var hasUpdate = false
                data && data.map(function (item, index) {
                    item.name = item.categoryName || item.channelName
                    item.url = "/build/components/general/channelList/ChannelList.html?channelId="
                        + item.channelId + "&channelName=" + item.name
                        + (item.categoryId ? "&categoryId=" + item.categoryId : "");

                    var code = item.code || Object.keys(_this.channels)[index]
                    item.code = code
                    var id = "college-content-" + code;

                    if (!isStory && cChannelData) {
                        if (!utils.objCmp(cChannelData[index], item)) {
                            console.log(item.code + '的more更新')
                            $("#" + id).prev().text(item.name)
                            $("#" + id).next().text(item.more)
                            $("#" + id).next().attr('href', item.url)
                            hasUpdate = true
                        } else {
                            console.log(item.code + '的more未更新')
                        }
                    }
                })
                if (hasUpdate)
                    _this.storyOpt('set', 'channels_more', data)
                if (isStory || !cChannelData) {
                    $(".channel-container").html(_.template($("#channel-container").html())({ data: data }))
                }
            },
            channelRequest: function (channels, isStory) {
                var _this = this;
                var data = channels;
                _this.channelMoreSet(data, isStory);

                data && data.map(function (item, index) {
                    var code = item.code || Object.keys(_this.channels)[index]
                    var id = "college-content-" + code;
                    _this.channels[code]["container"] = id;
                    var cdata = _this.storyOpt('get', _this.getChannelKey(index))
                    if (cdata) {
                        _this.hasInit = true
                        _this.channelDataOpt(cdata, id, index)
                    }
                    if (!_this.hasInit) {
                        var loading = utils.showLoading("#" + id)
                        _this.channels[code]["loading"] = loading;
                    }
                    if (!isStory)
                        _this.getAllChannelsData(item, index)
                })
            },
            getAllChannelsData: function (item, index) {
                var _this = this;

                (function (item, no) {
                    setTimeout(function () {
                        _this.getChannelsHome((data) => {
                            //先比较查询数据与存储数据，若相同则不更新
                            if (utils.objCmp(_this.storyOpt('get', _this.getChannelKey(no)), data)) {
                                console.log(item.code + "未更新")
                                return
                            } else {
                                _this.storyOpt('set', _this.getChannelKey(no), data)
                                console.log(item.code + "更新")
                            }

                            if (no === 0 || _this.channels[_this.getChannelKey(no - 1)]["hasShow"] === true) {
                                _this.channelDataOpt(data, _this.channels[item.code]["container"], no)
                            } else {
                                _this.taskQueue[no] = {
                                    no: no,
                                    data: data,
                                    container: _this.channels[item.code]["container"]
                                }
                            }
                        }, item.channelId, item.categoryId)
                    }, 0)
                })(item, index)
            },
            getChannelKey: function (no) {
                return Object.keys(this.channels)[no]
            },
            channelDataOpt: function (data, id, no) {
                var _this = this

                document.getElementById(id).innerHTML = "";
                if (!data || data.length <= 0) {
                    var empty = utils.createEle('div', { classs: ['empty'] })
                    var img = utils.createEle('img', { option: { src: "/build/img/empty.png" } })
                    var p = utils.createEle('p', { text: "暂无内容" })
                    empty.appendChild(img)
                    empty.appendChild(p)
                    var ele = empty;
                    $("#" + id).append(ele)
                    $("#" + id).next().hide()
                    return;
                }
                data.forEach(function (el, index) {
                    if (!el) return;
                    var element = null;
                    switch (el.itemType) {
                        case 1: element = new ArticleModel(id, el); break;
                        case 2: el.itemType = 1; element = new CourseSeries(id, el); break;
                        case 3: el.itemType = 2; element = new CourseSeries(id, el); break;
                        case 4: element = new Conference(id, el); break;
                    }
                    element && element.init();
                })

                _this.channels[_this.getChannelKey(no)]["hasShow"] = true

                if (no === 7) _this.hasInit = true
                var nextTask = _this.taskQueue[no + 1]
                if (nextTask) {
                    _this.channelDataOpt(nextTask.data, nextTask.container, no + 1)
                }
            },
            storyOpt: function (type, key, data) {
                if (type === 'set') {
                    localStorage.setItem('hgxy_data_' + key, JSON.stringify(data))
                } else if (type === 'get') {
                    var result = localStorage.getItem('hgxy_data_' + key)
                    if (result !== null && typeof result !== 'undefined')
                        result = JSON.parse(result)
                    return result
                }
            },
            getChannelsHome: function (callback, channelId, categoryId) {
                var params = { channelId: channelId }
                if (categoryId) params.categoryId = categoryId
                this.ajaxQueue.push(
                    huiguPost(function (data) {
                        if (data.code == 0) {
                            callback && callback(data.data);
                        } else {
                            utils.Errordata();
                        }
                    }, huiguPostUrl.getCollegeHome, params)
                )
            },
            getHomeBanner: function (callback) {
                huiguPost(function (data) {
                    if (data.code == 0) {
                        callback && callback(data.data);
                    } else {
                        utils.Errordata();
                    }
                }, huiguPostUrl.getHomeBanner,
                    {})
            },
            getChannels: function (callback) {
                huiguPost(function (data) {
                    if (data.code == 0) {
                        callback && callback(data.data);
                    } else {
                        utils.Errordata();
                    }
                }, huiguPostUrl.getChannels,
                    {})
            }
        }

        college.init();

    })
})