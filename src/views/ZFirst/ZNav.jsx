import React from 'react';
import classnames from 'classnames';

export const ZNav = (props) => {
    console.log("ZNav.props", props);
    return (<div className="nav" >
        <div className="w w1200">
            <div className="categorys">
                <div className="categorys-type">
                    <a href="categoryall.php" target="_blank">全部商品分类</a>
                </div>
                <div className="categorys-tab-content">
                    <div className="categorys-items" id="cata-nav">
                        {props.nav.map((item, index) => {
                            // console.log(item);
                            const itemClass = classnames('categorys-item', { 'selected': !!item.selected });
                            return (<div key={index} className={itemClass}
                                onMouseEnter={props.onMouseNav.bind(this, props.nav, item.id, true)}
                                onMouseLeave={props.onMouseNav.bind(this, props.nav, item.id, false)} >
                                <div className="item item-content">
                                    <i className="iconfont icon-ele"></i>
                                    <div className="categorys-title">
                                        <strong>
                                            {item.da.map((itema, indexa) => {
                                                // console.log(item);
                                                return (<a key={indexa} href={`category.php?id=${itema.daid}`} target="_blank">{itema.daname}
                                                { indexa != item.da.length-1?'、':null }
                                                </a> )
                                            })}

                                        </strong>
                                        <span>
                                            {item.db.map((itemb, indexb) => {
                                                return (<a key={indexb} href={`category.php?id=${itemb.dbid}`} target="_blank">{itemb.dbname}</a>);
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="categorys-items-layer"  >
                                    <div className="cate-layer-con clearfix"  ></div>
                                </div>
                                <div className="clear"></div>
                            </div>)
                        })}


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
    </div >
    )
}