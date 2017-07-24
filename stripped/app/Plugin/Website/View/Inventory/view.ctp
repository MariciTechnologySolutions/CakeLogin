<?php
$this->start('pagejs');
echo $this->Html->script(array_merge(array($asset['map'], $asset['infobox'])));
$this->end();
//$subject_address = $property['MlsData']['street_number'] . ' ' . $property['MlsData']['street_compass'] . ' ' . ucwords(strtolower($property['MlsData']['street_name'])) . ' ' . ucwords(strtolower($property['MlsData']['street_suffix'])) . ', ' . ucwords(strtolower($property['MlsData']['city'])) . ' ' . @$property['MlsData']['state'] . ' ' . $property['MlsData']['zipcode'];
//pr($property);
?>
<div class='wrapper'>
<div id="mapView"><div class="mapPlaceholder"><span class="fa fa-spin fa-spinner"></span> Loading map...</div></div>
<div id="content" class="mob-max">
                <div class="singleTop">
                    <div id="carouselFull" class="carousel slide" data-ride="carousel">
                        <ol class="carousel-indicators">
                            <li data-target="#carouselFull" data-slide-to="0" class="active"></li>
                            <li data-target="#carouselFull" data-slide-to="1"></li>
                            <li data-target="#carouselFull" data-slide-to="2"></li>
                            <li data-target="#carouselFull" data-slide-to="3"></li>
                        </ol>
                        <div class="carousel-inner">
                            <div class="item active">
                                <img src="images/prop/4-1.png" alt="First slide">
                                <div class="container">
                                    <div class="carousel-caption">
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <img src="images/prop/4-2.png" alt="Second slide">
                                <div class="container">
                                    <div class="carousel-caption">
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <img src="images/prop/4-3.png" alt="Third slide">
                                <div class="container">
                                    <div class="carousel-caption">
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <img src="images/prop/4-4.png" alt="Fourth slide">
                                <div class="container">
                                    <div class="carousel-caption">
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a class="left carousel-control" href="#carouselFull" role="button" data-slide="prev"><span class="fa fa-chevron-left"></span></a>
                        <a class="right carousel-control" href="#carouselFull" role="button" data-slide="next"><span class="fa fa-chevron-right"></span></a>
                    </div>
                    <div class="summary">
                        <div class="row">
                            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                <div class="summaryItem">
                                    <h1 class="pageTitle">Modern Residence in New York</h1>
                                    <div class="address"><span class="icon-pointer"></span> 39 Remsen St, Brooklyn, NY 11201, USA</div>
                                    <ul class="rating">
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star"></span></a></li>
                                        <li><a href="#"><span class="fa fa-star-o"></span></a></li>
                                        <li>(146)</li>
                                    </ul>
                                    <div class="favLink"><a href="#"><span class="icon-heart"></span></a>54</div>
                                    <ul class="stats">
                                        <li><span class="icon-eye"></span> 200</li>
                                        <li><span class="icon-bubble"></span> 13</li>
                                    </ul>
                                    <div class="clearfix"></div>
                                    <ul class="features">
                                        <li><span class="fa fa-moon-o"></span><div>2 Bedrooms</div></li>
                                        <li><span class="icon-drop"></span><div>2 Bathrooms</div></li>
                                        <li><span class="icon-frame"></span><div>2750 Sq Ft</div></li>
                                    </ul>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <div class="agentAvatar summaryItem">
                                     <div class="clearfix"></div>
                                    <img class="avatar agentAvatarImg" src="images/avatar-2.png" alt="avatar">
                                    <div class="agentName">Jane Smith</div>
                                    <a data-toggle="modal" href="#contactAgent" class="btn btn-lg btn-round btn-green contactBtn">Contact Agent</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="description">
                    <h3>Description</h3>
                    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
                </div>
                <div class="share">
                    <h3>Share on Social Networks</h3>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 shareItem">
                            <a href="#" class="btn btn-sm btn-round btn-o btn-facebook"><span class="fa fa-facebook"></span> Facebook</a>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 shareItem">
                            <a href="#" class="btn btn-sm btn-round btn-o btn-twitter"><span class="fa fa-twitter"></span> Twitter</a>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 shareItem">
                            <a href="#" class="btn btn-sm btn-round btn-o btn-google"><span class="fa fa-google-plus"></span> Google+</a>
                        </div>
                        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3 shareItem">
                            <a href="#" class="btn btn-sm btn-round btn-o btn-pinterest"><span class="fa fa-pinterest"></span> Pinterest</a>
                        </div>
                    </div>
                </div>
                <div class="amenities">
                    <h3>Amenities</h3>
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-car"></span> Garage</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-tint"></span> Outdoor Pool</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem inactive"><span class="fa fa-leaf"></span> Garden</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem inactive"><span class="fa fa-shield"></span> Security System</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-wifi"></span> Internet</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem inactive"><span class="fa fa-phone"></span> Telephone</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-asterisk"></span> Air Conditioning</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem inactive"><span class="fa fa-sun-o"></span> Heating</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-fire"></span> Fireplace</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-arrows-v"></span> Balcony</div>
                        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 amItem"><span class="fa fa-desktop"></span> TV Cable</div>
                    </div>
                </div>
                <div class="similar">
                    <h3>Similar Properties</h3>
                    <!-- carousel for medium & large devices -->
                    <div id="carouselSimilar-1" class="carousel slide visible-lg carousel-col">
                        <ol class="carousel-indicators">
                            <li data-target="#carouselSimilar-1" data-slide-to="0" class="active"></li>
                            <li data-target="#carouselSimilar-1" data-slide-to="1"></li>
                        </ol>
                        <div class="carousel-inner"> 
                            <div class="item active">
                                <div class="row">
                                    <div class="col-xs-4">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/1-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,550,000</div>
                                                    <span class="icon-eye"> 200</span>
                                                    <span class="icon-heart"> 54</span>
                                                    <span class="icon-bubble"> 13</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">FOR SALE</div>
                                            </div>
                                            <h2>Modern Residence in New York</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 39 Remsen St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 3430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/2-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,750,000</div>
                                                    <span class="icon-eye"> 175</span>
                                                    <span class="icon-heart"> 67</span>
                                                    <span class="icon-bubble"> 9</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Hauntingly Beautiful Estate</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 169 Warren St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 4430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/3-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,340,000</div>
                                                    <span class="icon-eye"> 180</span>
                                                    <span class="icon-heart"> 87</span>
                                                    <span class="icon-bubble"> 12</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Sophisticated Residence</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 38-62 Water St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 3</li>
                                                <li><span class="icon-frame"></span> 2640 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-4">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/4-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,930,000</div>
                                                    <span class="icon-eye"> 145</span>
                                                    <span class="icon-heart"> 99</span>
                                                    <span class="icon-bubble"> 25</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Sale</div>
                                            </div>
                                            <h2>House With a Lovely Glass-Roofed Pergola</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> Wunsch Bldg, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 2800 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/5-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$2,350,000</div>
                                                    <span class="icon-eye"> 184</span>
                                                    <span class="icon-heart"> 120</span>
                                                    <span class="icon-bubble"> 18</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Luxury Mansion</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 95 Butler St, Brooklyn, NY 11231, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 2750 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-4">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/1-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,550,000</div>
                                                    <span class="icon-eye"> 200</span>
                                                    <span class="icon-heart"> 54</span>
                                                    <span class="icon-bubble"> 13</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">FOR SALE</div>
                                            </div>
                                            <h2>Modern Residence in New York</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 39 Remsen St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 3430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a class="left carousel-control" href="#carouselSimilar-1" role="button" data-slide="prev"><span class="fa fa-chevron-left"></span></a>
                        <a class="right carousel-control" href="#carouselSimilar-1" role="button" data-slide="next"><span class="fa fa-chevron-right"></span></a>
                    </div>

                    <!-- carousel for small devices -->
                    <div id="carouselSimilar-2" class="carousel slide visible-md carousel-col"> 
                        <ol class="carousel-indicators">
                            <li data-target="#carouselSimilar-2" data-slide-to="0" class="active"></li>
                            <li data-target="#carouselSimilar-2" data-slide-to="1"></li>
                            <li data-target="#carouselSimilar-2" data-slide-to="2"></li>
                        </ol>
                        <div class="carousel-inner"> 
                            <div class="item active">
                                <div class="row">
                                    <div class="col-xs-6">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/1-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,550,000</div>
                                                    <span class="icon-eye"> 200</span>
                                                    <span class="icon-heart"> 54</span>
                                                    <span class="icon-bubble"> 13</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">FOR SALE</div>
                                            </div>
                                            <h2>Modern Residence in New York</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 39 Remsen St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 3430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/2-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,750,000</div>
                                                    <span class="icon-eye"> 175</span>
                                                    <span class="icon-heart"> 67</span>
                                                    <span class="icon-bubble"> 9</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Hauntingly Beautiful Estate</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 169 Warren St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 4430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-6">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/3-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,340,000</div>
                                                    <span class="icon-eye"> 180</span>
                                                    <span class="icon-heart"> 87</span>
                                                    <span class="icon-bubble"> 12</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Sophisticated Residence</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 38-62 Water St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 3</li>
                                                <li><span class="icon-frame"></span> 2640 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/4-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,930,000</div>
                                                    <span class="icon-eye"> 145</span>
                                                    <span class="icon-heart"> 99</span>
                                                    <span class="icon-bubble"> 25</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Sale</div>
                                            </div>
                                            <h2>House With a Lovely Glass-Roofed Pergola</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> Wunsch Bldg, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 2800 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-6">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/5-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$2,350,000</div>
                                                    <span class="icon-eye"> 184</span>
                                                    <span class="icon-heart"> 120</span>
                                                    <span class="icon-bubble"> 18</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Luxury Mansion</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 95 Butler St, Brooklyn, NY 11231, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 2750 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-6">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/1-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,550,000</div>
                                                    <span class="icon-eye"> 200</span>
                                                    <span class="icon-heart"> 54</span>
                                                    <span class="icon-bubble"> 13</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">FOR SALE</div>
                                            </div>
                                            <h2>Modern Residence in New York</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 39 Remsen St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 3430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><!-- carousel-inner -->
                        <a class="left carousel-control" href="#carouselSimilar-2" role="button" data-slide="prev"><span class="fa fa-chevron-left"></span></a>
                        <a class="right carousel-control" href="#carouselSimilar-2" role="button" data-slide="next"><span class="fa fa-chevron-right"></span></a>
                    </div>

                    <!-- carousel for extra-small devices -->
                    <div id="carouselSimilar-3" class="carousel slide visible-xs visible-sm carousel-col">
                        <ol class="carousel-indicators">
                            <li data-target="#carouselSimilar-3" data-slide-to="0" class="active"></li>
                            <li data-target="#carouselSimilar-3" data-slide-to="1"></li>
                            <li data-target="#carouselSimilar-3" data-slide-to="2"></li>
                            <li data-target="#carouselSimilar-3" data-slide-to="3"></li>
                            <li data-target="#carouselSimilar-3" data-slide-to="4"></li>
                            <li data-target="#carouselSimilar-3" data-slide-to="5"></li>
                        </ol>
                        <div class="carousel-inner"> 
                            <div class="item active">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/1-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,550,000</div>
                                                    <span class="icon-eye"> 200</span>
                                                    <span class="icon-heart"> 54</span>
                                                    <span class="icon-bubble"> 13</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">FOR SALE</div>
                                            </div>
                                            <h2>Modern Residence in New York</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 39 Remsen St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 3430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/2-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,750,000</div>
                                                    <span class="icon-eye"> 175</span>
                                                    <span class="icon-heart"> 67</span>
                                                    <span class="icon-bubble"> 9</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Hauntingly Beautiful Estate</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 169 Warren St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 4430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/3-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,340,000</div>
                                                    <span class="icon-eye"> 180</span>
                                                    <span class="icon-heart"> 87</span>
                                                    <span class="icon-bubble"> 12</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Sophisticated Residence</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 38-62 Water St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 3</li>
                                                <li><span class="icon-frame"></span> 2640 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/4-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,930,000</div>
                                                    <span class="icon-eye"> 145</span>
                                                    <span class="icon-heart"> 99</span>
                                                    <span class="icon-bubble"> 25</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Sale</div>
                                            </div>
                                            <h2>House With a Lovely Glass-Roofed Pergola</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> Wunsch Bldg, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 2800 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/5-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$2,350,000</div>
                                                    <span class="icon-eye"> 184</span>
                                                    <span class="icon-heart"> 120</span>
                                                    <span class="icon-bubble"> 18</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">For Rent</div>
                                            </div>
                                            <h2>Luxury Mansion</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 95 Butler St, Brooklyn, NY 11231, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 2</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 2750 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <div data-linkto="single.html" class="card">
                                            <div class="figure">
                                                <img src="images/prop/1-1.png" alt="image">
                                                <div class="figCaption">
                                                    <div>$1,550,000</div>
                                                    <span class="icon-eye"> 200</span>
                                                    <span class="icon-heart"> 54</span>
                                                    <span class="icon-bubble"> 13</span>
                                                </div>
                                                <div class="figView"><span class="icon-eye"></span></div>
                                                <div class="figType">FOR SALE</div>
                                            </div>
                                            <h2>Modern Residence in New York</h2>
                                            <div class="cardAddress"><span class="icon-pointer"></span> 39 Remsen St, Brooklyn, NY 11201, USA</div>
                                            <ul class="cardFeat">
                                                <li><span class="fa fa-moon-o"></span> 3</li>
                                                <li><span class="icon-drop"></span> 2</li>
                                                <li><span class="icon-frame"></span> 3430 Sq Ft</li>
                                            </ul>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a class="left carousel-control" href="#carouselSimilar-3" role="button" data-slide="prev"><span class="fa fa-chevron-left"></span></a>
                        <a class="right carousel-control" href="#carouselSimilar-3" role="button" data-slide="next"><span class="fa fa-chevron-right"></span></a>
                    </div>
                </div>
                <div class="comments">
                    <h3><span>4</span> Comments</h3>
                    <div class="comment">
                        <div class="commentAvatar">
                            <img class="avatar" src="images/avatar-3.png" alt="avatar">
                            <div class="commentArrow"><span class="fa fa-caret-left"></span></div>
                        </div>
                        <div class="commentContent">
                            <div class="commentName">Rust Cohle</div>
                            <div class="commentBody">
                                It is a long established fact that a reader will be distracted by the readable content
                            </div>
                            <div class="commentActions">
                                <div class="commentTime"><span class="icon-clock"></span> 1 day ago</div>
                                <ul>
                                    <li><a href="#"><span class="icon-action-undo"></span></a></li>
                                    <li><a href="#"><span class="icon-like"></span> 13</a></li>
                                </ul>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="comment reply">
                        <div class="commentAvatar">
                            <img class="avatar" src="images/avatar-1.png" alt="avatar">
                            <div class="commentArrow"><span class="fa fa-caret-left"></span></div>
                        </div>
                        <div class="commentContent">
                            <div class="commentName">John Smith</div>
                            <div class="commentBody">
                                Comment posted by me. I have the power to remove it.
                            </div>
                            <div class="commentActions">
                                <div class="commentTime"><span class="icon-clock"></span> 2 hours ago</div>
                                <ul>
                                    <li><a href="#"><span class="fa fa-trash-o"></span></a></li>
                                </ul>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="comment">
                        <div class="commentAvatar">
                            <img class="avatar" src="images/avatar-5.png" alt="avatar">
                            <div class="commentArrow"><span class="fa fa-caret-left"></span></div>
                        </div>
                        <div class="commentContent">
                            <div class="commentName">Alex Rogers</div>
                            <div class="commentBody">
                                Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
                            </div>
                            <div class="commentActions">
                                <div class="commentTime"><span class="icon-clock"></span> 20 minutes ago</div>
                                <ul>
                                    <li><a href="#"><span class="icon-action-undo"></span></a></li>
                                    <li><a href="#"><span class="icon-like"></span> 13</a></li>
                                </ul>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="comment">
                        <div class="commentAvatar">
                            <img class="avatar" src="images/avatar-2.png" alt="avatar">
                            <div class="commentArrow"><span class="fa fa-caret-left"></span></div>
                        </div>
                        <div class="commentContent">
                            <div class="commentName">Jane Smith</div>
                            <div class="commentBody">
                                Lorem ipsum dolor sit amet, consecteter adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
                            </div>
                            <div class="commentActions">
                                <div class="commentTime"><span class="icon-clock"></span> 5 minutes ago</div>
                                <ul>
                                    <li><a href="#"><span class="icon-action-undo"></span></a></li>
                                    <li><a href="#"><span class="icon-like"></span> 13</a></li>
                                </ul>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
</div>