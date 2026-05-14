<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'nicolaikoldby_dkjrgrafisk' );

/** Database username */
define( 'DB_USER', 'nicolaikoldby_dkjrgrafisk' );

/** Database password */
define( 'DB_PASSWORD', 'e4sekcpqq' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '[7aT&ZDs1o?%QiQ@Z=O`a6maDVbP%7|K!TSFS#izgQ.#J|P;GuH.<I(CsB$5CxP$' );
define( 'SECURE_AUTH_KEY',  '|929zl/:>TmM/I,3V}Q/9|`)kBnsOmIvGQd/eW Z987aw[d9=35&)nZgw$x2qU4}' );
define( 'LOGGED_IN_KEY',    'M#%-ZB~((1S^U<G{70+[=?tehublAHOu^`Z}X5|fa{iaQ#a#6g_g[={5Ia/Y}$;^' );
define( 'NONCE_KEY',        '6.D8}B;22#7%)BLwA(~z.5[/~sOaCg>[q.iCw%:b`luf|&?o2/soGc;n3ONjPyBv' );
define( 'AUTH_SALT',        'qzCi,Z;BvaE]<u5S_]o/>U(J-zJ)1uI$.]PAk^F#_a7^4(>tt,ko2AoP[;(W-}/K' );
define( 'SECURE_AUTH_SALT', '1M4;kCkU|K97%TEWcP0mA=/8<h)ftZ_BY]JG4*;[:1Fi2 hYOH0mh8b)2<Gb9Ku^' );
define( 'LOGGED_IN_SALT',   '1QC7[cOn,<x?b^)c6i6/T8$nXi-9Kool9RQ,tz[z4f*Ol!Q8fm-RE|v[-N.GWJ(s' );
define( 'NONCE_SALT',       'g-V,eY$.%4O6AXv}=jQfFgOa}Nw#eZ/wu~CU=le,,+Zk a%$4n21(vA+V[%Tuf-u' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
