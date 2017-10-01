<?php
add_action( 'phpmailer_init', 'wp_mailer_init' );
function wp_mailer_init( &$mail ) {
	$mail->isSMTP();
	$mail->Host       = 'smtp.gmail.com';
	$mail->SMTPAuth   = true;
	$mail->Username   = 'tunn@foobla.com';
	$mail->Password   = 'tunn@!07@)!)';
	$mail->SMTPSecure = 'tls';
	$mail->Port       = 587;

}

add_action( 'get_header', function () {
	//do_action( 'learn-press/order/status-pending-to-processing/notification', 1313 );

	//do_action( 'woocommerce_order_status_pending_to_processing_notification', 1308 );

	$email = LP_Emails::get_email('completed-order-guest');

	$email->trigger(1313);

	$message = $email->apply_style_inline( $email->get_content());

	echo $message;
die();

} );
add_action( 'initx', function () {

	global $wpdb;
	$question_id = $wpdb->get_col( "
		SELECT question_id FROM {$wpdb->learnpress_quiz_questions}
		WHERE quiz_id = 20;
	" );
	$types       = array( 'true_or_false', 'single_choice', 'multi_choice' );
	foreach ( $question_id as $id ) {
		$wpdb->query( "
			update wp_postmeta set meta_value = '" . $types[ rand( 0, 2 ) ] . "'
			where meta_key = '_lp_type'
			And post_id=" . $id . "
		" );
	}
	$answers = $wpdb->get_results( "
		select *
		from wp_learnpress_question_answers 
		where question_id = 26
	" );
	learn_press_debug( $answers );
	die();
	foreach ( $question_id as $id ) {
		$i = 0;
		foreach ( $answers as $answer ) {
			$answer_data         = unserialize( $answer->answer_data );
			$answer_data['text'] = 'Option #' . $i ++;
			if ( $i === 1 ) {
				$answer_data['is_true'] = 'yes';
			} else {
				$answer_data['is_true'] = 'no';
			}
			$answer_data['value'] = md5( microtime() );


			$wpdb->query( "insert into wp_learnpress_question_answers ( question_id, answer_data, answer_order) values(" . $id . ",'" . serialize( $answer_data ) . "'," . $i . ")" );
		}
	}
	die();
} );

/**
 * The code below are used for testing purpose
 *
 * TODO: Remove these code before releasing.
 */
add_filter( 'learn-press/checkout-no-payment-resultxxx', function ( $results, $order_id ) {
	$order = learn_press_get_order( $order_id );
	if ( $order->is_completed() ) {
		$order_users = $order->get_users();
		$users       = array();
		foreach ( $order->get_items() as $item ) {
			$course = learn_press_get_course( $item['course_id'] );
			if ( $course->is_publish() ) {
				foreach ( $order_users as $user_id ) {
					if ( empty( $users[ $user_id ] ) ) {
						$user = learn_press_get_user( $user_id );
						if ( ! $user->is_exists() ) {
							continue;
						}

						$users[ $user_id ] = $user;
					}

					$users[ $user_id ]->enroll( $course->get_id(), $order->get_id() );
				}
			}
		}
	}

	return $results;
}, 10, 2 );
function xyz() {
	if ( empty( $_REQUEST['xxxxx'] ) ) {
		return;
	}
	remove_action( 'get_header', 'xyz' );
	do_action( 'wp_head' );
	learn_press_get_template( 'single-course/tabs/curriculum.php' );
	learn_press_get_template( 'single-course/content-item.php' );
	do_action( 'wp_footer' );
	die();
}

add_action( 'get_header', 'xyz' );

add_action( 'learn_press/before_course_item_content', function ( $a, $b ) {
	echo '<a href="' . get_permalink( $b ) . '">' . __( 'Course', 'learnpress' ) . '</a>';
}, 10, 2 );

//add_action( 'init', function () {
//	$file = get_cache_file();
//
//	if ( file_exists( $file ) && strtolower( $_SERVER['REQUEST_METHOD'] ) !== 'post' ) {
//		echo file_get_contents( $file );
//		die();
//	}
//	ob_start( 'xxxxx' );
//} );
//
//function xxxxx( $buffer ) {
//	$file = get_cache_file();
//	file_put_contents( $file, $buffer );
//
//	return $buffer;
//}
//
//function get_cache_file() {
//	$dir  = wp_upload_dir();
//	@mkdir($dir['basedir'] . '/cache/');
//	$file = $dir['basedir'] . '/cache/' . md5( learn_press_get_current_url() ) . '.lp';
//
//	return $file;
//}
//function rrmdir($dir) {
//	if (is_dir($dir)) {
//		$objects = scandir($dir);
//		foreach ($objects as $object) {
//			if ($object != "." && $object != "..") {
//				if (is_dir($dir."/".$object))
//					rrmdir($dir."/".$object);
//				else
//					unlink($dir."/".$object);
//			}
//		}
//		rmdir($dir);
//	}
//}
//add_filter('query', function($query){
//	if(preg_match( '/^\s*(insert|delete|update|replace)\s/i', $query ) ){
//		$dir  = wp_upload_dir();
//		$file = $dir['basedir'] . '/cache/';
//		rrmdir($file);
//	}
//	return $query;
//});
//function shutdown() {
//	global $wpdb;
//
//	// This is our shutdown function, in
//	// here we can do any last operations
//	// before the script is complete.
//}
//
//register_shutdown_function( 'shutdown' );