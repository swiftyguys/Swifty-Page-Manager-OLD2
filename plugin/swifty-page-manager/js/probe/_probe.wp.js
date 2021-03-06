( function( $, probe ) {
    probe.WP = probe.WP || {};

    probe.WP.AdminOpenSubmenu = {
        Start: function( /*input*/ ) {
            // Check if the WP menu is collapsed (to one icon) ( happens on small screens )
            $( "li#wp-admin-bar-menu-toggle" )
                .IfVisible()
                .OtherIfNotVisible( "ul#adminmenu" )
                .Click();

            // Wait until the submenu becomes visible
            $( "ul#adminmenu" ).WaitForVisible( "Step2" );
        },

        Step2: function( input ) {
            // Click on the menu item in the left admin bar
            $( this.GetSelMainmenu( input.plugin_code ) )
                .MustExist()
                .Click();

            // Wait until the submenu becomes visible
            $( this.GetSelSubmenu( input.submenu_text ) ).WaitForFn( "Wait2", "Step3" );
        },

        Wait2: function( input ) {
            // Trick WP into thinking the mouse hovers over the menu item (so the submenu popup opens)
            // In some cases (WP version, screen size) this hover is needed
            $( this.GetSelMainmenu( input.plugin_code ) ).AddClass( "opensub" );

            // Is the submenu item visible?
            var check = $( this.GetSelSubmenu( input.submenu_text ) ).IsVisible();

            return { "wait_result": check };
        },

        Step3: function( input ) {
            // Click on the sub menu
            $( this.GetSelSubmenu( input.submenu_text ) )
                .MustExist()
                .Click();
        },

        GetSelMainmenu: function( pluginCode ) {
            return "li#menu-" + pluginCode;
        },

        GetSelSubmenu: function( submenuText ) {
            return "a:contains('" + submenuText + "')";
        }
    };

    ////////////////////////////////////////

    probe.WP.ActivatePlugin = {
        Start: function( input ) { // dorh Not tested
            $( "a:contains('" + input.s_activate + "')[href*='plugin=" + input.plugin_code + "']" ).Click();
        }
    };

    probe.WP.DeleteAllPages = {
        Start: function( /*input*/ ) {
            probe.QueueStory(
                'WP.AdminOpenSubmenu',
                {
                    'plugin_code': 'pages',
                    'submenu_text': 'All Pages'   // Here we need something for translations
                },
                'Step2'
            );
        },

        Step2: function( /*input*/ ) {
            // Click on the checkbox to select all pages
            $( '#cb-select-all-1' )
                .MustExist()
                .Click();

            // Select the trash option
            $( 'select[name="action"]' )
                .MustExist()
                .val( [ 'trash' ] );

            // Click on the Apply button
            $( '#doaction' )
                .MustExist()
                .Click();
        }
    };

    ////////////////////////////////////////

    probe.WP.EmptyTrash = {
        Start: function( /*input*/ ) {
            probe.QueueStory(
                'WP.AdminOpenSubmenu',
                {
                    'plugin_code': 'pages',
                    'submenu_text': 'All Pages'   // Here we need something for translations
                },
                'Step2'
            );
        },

        Step2: function( /*input*/ ) {
            // Click on the 'Trash' link
            $( 'li.trash a' )
                .MustExist()
                .Click();

            // Wait until the 'Empty Trash' button becomes visible
            $( '#delete_all' ).WaitForVisible( 'Step3' );
        },

        Step3: function( /*input*/ ) {
            // Click on the 'Empty Trash' button
            $( '#delete_all' )
                .MustExist()
                .Click();
        }
    };

    ////////////////////////////////////////

    probe.WP.CreateXDraftPages = {
        Start: function( /*input*/ ) {
            probe.QueueStory(
                'WP.AdminOpenSubmenu',
                {
                    'plugin_code': 'pages',
                    'submenu_text': 'All Pages'   // Here we need something for translations
                },
                'Step2'
            );
        },

        Step2: function( input ) {
            $( 'a.add-new-h2' ).WaitForVisible( 'Step3', 5000, 0 );
        },

        Step3: function( input ) {
            if ( input.wait_data <= input.x_pages ) {
                // Click on the 'Create new' link
                $( 'a.add-new-h2' )
                    .MustExist()
                    .Click();

                $( 'input[name="save"]' ).WaitForVisible( 'Step4' );
            }
        },

        Step4: function( input ) {
            var currentNr = 1;

            if ( typeof input.wait_data !== "undefined" ) {
                probe.TmpLog( "currentNr " + currentNr );
                currentNr = input.wait_data;

                $( 'input[name="post_title"]' ).val( 'WP Page ' + currentNr );
                $( 'input[name="save"]' ).MustExist().Click();
            }

            if ( currentNr <= input.x_pages ) {
                currentNr++;

                $( 'a.add-new-h2' ).WaitForVisible( 'Step3', 5000, currentNr );
            }
        }
    };

    ////////////////////////////////////////

} )( jQuery, swiftyProbe );