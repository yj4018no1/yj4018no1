import React from 'react';
import imgavatar from "styles/images/avatar.png";

export const ZHomeIndex = (props) => {

    return (
        <div className="homeindex"  >
            <div className="content content-index01">
                <div className="visual-item" data-mode="lunbo" data-purebox="adv" data-li="1" data-length="5"  
                    data-diff="0" style={{"display": "block"}}>

                    <div className="view">
                        <div className="banner-wrapper">

                            <div className="banner home-banner">
                                <div className="bd">
                                    <ul data-type="range" data-slide="fold">
                                        <li style={{"backgroundImage":"url(https://test.dscmall.cn/data/gallery_album/61/original_img/1516668314344982350.jpg)","backgroundPosition":"center center", "backgroundRepeat": "no-repeat","backgroundColor":null}}>
                                            <div className="banner-width"><a href="http://www.dscmall.cn" target="_blank"
                                                style={{"height":500+"px"}}></a></div>
                                        </li>
                                        <li
                                            style={{"backgroundImage":"url(https://test.dscmall.cn/data/gallery_album/61/original_img/1516668314496790457.jpg)", "backgroundPosition": "center center", "backgroundRepeat": "no-repeat", "backgroundColor":null}}>
                                            <div className="banner-width"><a href="https://test.dscmall.cn/category.php?id=33"
                                                target="_blank" style={{"height":500+"px"}}></a></div>
                                        </li>
                                        <li
                                            style={{"backgroundImage":"url(https://test.dscmall.cn/data/gallery_album/61/original_img/1516730167912917360.jpg)", "backgroundPosition": "center center", "backgroundRepeat": "no-repeat", "backgroundColor":null}}>
                                            <div className="banner-width"><a href="https://test.dscmall.cn/category.php?id=858"
                                                target="_blank" style={{"height":500+"px"}}></a></div>
                                        </li>

                                    </ul>
                                    <div className="spec" data-spec=""></div>
                                </div>
                                <div className="hd">
                                    <ul></ul>
                                </div>
                            </div>
                            <div className="vip-outcon">
                                <div className="vip-con">
                                    <div className="insertVipEdit" data-mode="insertVipEdit">
                                        <div className="userVip-info"  >

                                            <div className="avatar">
                                                <a href="user.php?act=profile"><img src={imgavatar} /></a>
                                            </div>

                                            <div className="login-info">
                                                <span>Hi，欢迎来到KingB2B演示站!</span>
                                                <a href="user.php" className="login-button">请登录</a>
                                                <a href="merchants.php" target="_blank" className="register_button">我要加盟</a>
                                            </div>

                                            <input type="hidden" name="user_id"   value="0" />

                                        </div>
                                        <div className="vip-item vip_article_cat">
                                            <div className="tit">
                                                <a href="javascript:void(0);" className="tab_head_item" data-catid="20">公告</a>
                                                <a href="javascript:void(0);" className="tab_head_item" data-catid="21">消息</a>
                                            </div>
                                            <div className="con">
                                                <ul data-id="20">
                                                    <li><a href="article.php?id=63" target="_blank">服务店突破2000多家</a></li>
                                                    <li><a href="article.php?id=62" target="_blank">我们成为中国最大家电零售B2B2C系统</a></li>
                                                    <li><a href="article.php?id=61" target="_blank">三大国际腕表品牌签约</a></li>
                                                </ul>
                                                <ul style={{"display":"none"}} data-id="21">
                                                    <li><a href="article.php?id=60" target="_blank">春季家装季，家电买一送一</a></li>
                                                    <li><a href="article.php?id=59" target="_blank">抢百元优惠券，享4.22%活期</a></li>
                                                    <li><a href="article.php?id=58" target="_blank">Macbook最高返50000消费豆！</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="vip-item backup_festival_1">
                                            <div className="tit" >
                                            {/* style = {{"textSizeAdjust": 100+"%"}} */}
                                                <span>快捷入口</span>
                                            </div>
                                            <div className="kj_con">
                                                <div className="item item_1">
                                                    <a href="history_list.php" target="_blank">
                                                        <i className="img-browse"></i>
                                                        <span>我的浏览</span>
                                                    </a>
                                                </div>
                                                <div className="item item_2">
                                                    <a href="user.php?act=collection_list" target="_blank">
                                                        <i className="img-zan"></i>
                                                        <span>我的收藏</span>
                                                    </a>
                                                </div>
                                                <div className="item item_3">
                                                    <a href="user.php?act=order_list" target="_blank">
                                                        <i className="img-order"></i>
                                                        <span>我的订单</span>
                                                    </a>
                                                </div>

                                                <div className="item item_4">
                                                    <a href="user.php?act=account_safe" target="_blank">
                                                        <i className="img-password"></i>
                                                        <span>资金管理</span>
                                                    </a>
                                                </div>
                                                <div className="item item_5">
                                                    <a href="user.php?act=affiliate" target="_blank">
                                                        <i className="img-share"></i>
                                                        <span>快捷下单</span>
                                                    </a>
                                                </div>
                                                <div className="item item_6">
                                                    <a href="merchants.php" target="_blank">
                                                        <i className="img-settled"></i>
                                                        <span>我的关注</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="spec" data-spec=""></div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}