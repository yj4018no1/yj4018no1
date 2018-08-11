import React from 'react';
import imglogo from "styles/images/logo.png";

export const ZHeader = (props) => {
    console.log("ZHeader.props", props);
    return (<div className="header">
        <div className="w w1200">
            <div className="logo">
                <div className="logoImg"><a href="/"><img src={imglogo} /></a></div>
            </div>
            <div className="header_con">
                <div className="site-nav" id="site-nav">
                    <div className="fl ml10">
                        <div className="city-choice" id="city-choice"  >
                            <div className="dsc-choie dsc-cm"  >
                                <i className="iconfont icon-map-marker"></i>
                                <span className="ui-areamini-text" data-id="1" title="上海路一店">上海路一店</span>
                            </div>
                            <div className="dorpdown-layer"  >
                            </div>
                        </div>
                        <div className="txt-info" id="ECS_MEMBERZONE">

                            <span>您好 &nbsp;<a >89713722-832183</a></span>
                            <span>，欢迎来到&nbsp;<a alt="首页" title="首页" >{ props.headerData.sitename }</a></span>
                            <span>[<a onClick = {props.handleFunc.bind(this,"hello")}>退出</a>]</span>
                        </div>
                    </div>
                    <ul className="quick-menu fr">
                        <li>
                            <div className="dt"><a href="user.php?act=order_list">我的订单</a></div>
                        </li>
                        <li className="spacer"></li>
                        <li>
                            <div className="dt"><a href="history_list.php">我的浏览</a></div>
                        </li>
                        <li className="spacer"></li>
                        <li>
                            <div className="dt"><a href="user.php?act=collection_list">我的收藏</a></div>
                        </li>
                    </ul>
                </div>
                <div className="dsc-search">
                    <div className="form">
                        <div className="search-form">
                            <input name="keywords" type="text" id="keyword" placeholder="Five Plus" className="search-text" />
                            <input type="hidden" name="store_search_cmt" value="0" />
                            <button type="submit" className="button button-goods"  >搜商品</button>
                            <button type="submit" className="button button-store"  >搜品牌</button>
                        </div>
                        <ul className="keyword">
                            <li><a href="search.php?keywords=%E5%91%A8%E5%A4%A7%E7%A6%8F" target="_blank">周大福</a></li>
                            <li><a href="search.php?keywords=%E5%86%85%E8%A1%A3" target="_blank">内衣</a></li>
                            <li><a href="search.php?keywords=Five+Plus" target="_blank">Five Plus</a></li>
                            <li><a href="search.php?keywords=%E6%89%8B%E6%9C%BA" target="_blank">手机</a></li>
                        </ul>

                        <div className="suggestions_box" id="suggestions" style={{ "display": "none" }}>
                            <div className="suggestions_list" id="auto_suggestions_list">
                                &nbsp;
                    </div>
                        </div>
                    </div>
                </div>

                <div className="shopCart" id="ECS_CARTINFO"  >
                    <div className="shopCart-con dsc-cm">
                        <a href="flow.php">
                            <i className="iconfont icon-carts"></i>
                            <span>我的购物车</span>
                            <em className="count cart_num">0</em>
                        </a>
                    </div>
                    <div className="dorpdown-layer"  >
                        <div className="prompt">
                            <div className="nogoods"><b></b><span>购物车中还没有商品，赶紧选购吧！</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}