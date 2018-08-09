import React from 'react';

export const ZNav = () => {
    return (<div className="nav" >
        <div className="w w1200">
            <div className="categorys">
                <div className="categorys-type">
                    <a href="categoryall.php" target="_blank">全部商品分类</a>
                </div>
                <div className="categorys-tab-content">
                    <div className="categorys-items" id="cata-nav">
                        <div className="categorys-item"  >
                            <div className="item item-content">
                                <i className="iconfont icon-ele"></i>
                                <div className="categorys-title">
                                    <strong>
                                        <a href="category.php?id=858" target="_blank">家用电器</a>
                                    </strong>
                                    <span>
                                        <a href="category.php?id=1105" target="_blank">大家电</a>
                                        <a href="category.php?id=1115" target="_blank">生活电器</a>
                                    </span>
                                </div>
                            </div>
                            <div className="categorys-items-layer"  >
                                <div className="cate-layer-con clearfix"  ></div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="categorys-item" data-id="3" data-eveval="0">
                            <div className="item item-content">
                                <i className="iconfont icon-digital"></i>
                                <div className="categorys-title">
                                    <strong>
                                        <a href="category.php?id=33" target="_blank" className="division_cat">手机</a>、
<a href="category.php?id=64" target="_blank" className="division_cat">数码</a>、
<a href="category.php?id=37" target="_blank" className="division_cat">通信</a>
                                    </strong>
                                    <span>
                                        <a href="category.php?id=112" target="_blank">智能设备</a>
                                        <a href="category.php?id=76" target="_blank">数码配件</a>
                                    </span>
                                </div>
                            </div>
                            <div className="categorys-items-layer"  >
                                <div className="cate-layer-con clearfix"  ></div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="categorys-item" data-id="4" data-eveval="0">
                            <div className="item item-content">
                                <i className="iconfont icon-computer"></i>
                                <div className="categorys-title">
                                    <strong>
                                        <a href="category.php?id=4" target="_blank">电脑、办公</a>
                                    </strong>
                                    <span>
                                        <a href="category.php?id=158" target="_blank">服务产品</a>
                                        <a href="category.php?id=132" target="_blank">电脑整机</a>
                                    </span>
                                </div>
                            </div>
                            <div className="categorys-items-layer"  >
                                <div className="cate-layer-con clearfix"  ></div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="categorys-item" data-id="5" data-eveval="0">
                            <div className="item item-content">
                                <i className="iconfont icon-bed"></i>
                                <div className="categorys-title">
                                    <strong>
                                        <a href="category.php?id=5" target="_blank">家居、家具、家装、厨具</a>
                                    </strong>
                                    <span>
                                        <a href="category.php?id=143" target="_blank">厨具</a>
                                        <a href="category.php?id=159" target="_blank">家装建材</a>
                                    </span>
                                </div>
                            </div>
                            <div className="categorys-items-layer"  >
                                <div className="cate-layer-con clearfix"  ></div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="categorys-item" data-id="6" data-eveval="0">
                            <div className="item item-content">
                                <i className="iconfont icon-clothes"></i>
                                <div className="categorys-title">
                                    <strong>
                                        <a href="category.php?id=6" target="_blank">男装、女装、内衣</a>
                                    </strong>
                                    <span>
                                        <a href="category.php?id=347" target="_blank">女装</a>
                                        <a href="category.php?id=463" target="_blank">男装</a>
                                    </span>
                                </div>
                            </div>
                            <div className="categorys-items-layer"  >
                                <div className="cate-layer-con clearfix"  ></div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="categorys-item" data-id="8" data-eveval="0">
                            <div className="item item-content">
                                <i className="iconfont icon-shoes"></i>
                                <div className="categorys-title">
                                    <strong>
                                        <a href="category.php?id=8" target="_blank">鞋靴、箱包、钟表、奢侈品</a>
                                    </strong>
                                    <span>
                                        <a href="category.php?id=362" target="_blank">奢侈品</a>
                                        <a href="category.php?id=360" target="_blank">功能箱包</a>
                                    </span>
                                </div>
                            </div>
                            <div className="categorys-items-layer"  >
                                <div className="cate-layer-con clearfix"  ></div>
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="categorys-item" data-id="860" data-eveval="0">
                            <div className="item item-content">
                                <i className="iconfont icon-heal"></i>
                                <div className="categorys-title">
                                    <strong>
                                        <a href="category.php?id=860" target="_blank">个人化妆、清洁用品</a>
                                    </strong>
                                    <span>
                                        <a href="category.php?id=876" target="_blank">面部护肤</a>
                                        <a href="category.php?id=880" target="_blank">洗发护发</a>
                                    </span>
                                </div>
                            </div>
                            <div className="categorys-items-layer"  >
                                <div className="cate-layer-con clearfix"  ></div>
                            </div>
                            <div className="clear"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="nav-main" id="nav">
                <ul className="navitems" data-type="range">
                    <li>
                        <a href="index.php" className="curr">首页</a>
                    </li>
                    <li>
                        <a href="category.php?id=6" target="_blank">常规下单</a>
                    </li>
                    <li>
                        <a href="category.php?id=12" target="_blank">政策下单</a>
                    </li>
                    <li>
                        <a href="category.php?id=362" target="_blank">进货核货</a>
                    </li>
                    <li>
                        <a href="category.php?id=8" target="_blank">订单中心</a>
                    </li>
                    <li>
                        <a href="brand.php" target="_blank">财务中心</a>
                    </li>

                    <div className="spec" ></div>
                </ul>
            </div>
        </div>
    </div>)
}