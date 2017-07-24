<?php


    Router::connect(

            '/inventory/feed', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'inventory', 
                'action'        => 'feed'
            )
    );

    Router::connect(
            '/about', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'company', 
                'action'        => 'about'
            )
    );

    Router::connect(
            '/blog', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'company', 
                'action'        => 'blog'
            )
    );
    
    Router::connect(
            '/register/*', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'company', 
                'action'        => 'register'
            )
    );

    Router::connect(
            '/agents', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'company', 
                'action'        => 'agents'
            )
    );
    
    Router::connect(
            '/help', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'company', 
                'action'        => 'help'
            )
    );
    
    Router::connect(
            '/inventory/*', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'MlsData', 
                'action'        => 'index'
            )
    );
    
    Router::connect(
            '/property-details/*', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'MlsData', 
                'action'        => 'view'
            )
    );    
    
    Router::connect(
            '/privacy', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'Company', 
                'action'        => 'privacy'
            )
    );  
    
    Router::connect(
            '/cashoffer24', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'MlsData', 
                'action'        => 'new_property'
            )
    );    
    Router::connect(
            '/cashoffer', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'MlsData', 
                'action'        => 'new_property'
            )
    );    
    Router::connect(
            '/cash', 
            array(
                'plugin'        => 'Website',
                'controller'    => 'MlsData', 
                'action'        => 'new_property'
            )
    );    