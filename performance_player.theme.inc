<?php

/**
 * @file
 */

/**
 *
 */
function template_preprocess_views_performance_player(array &$vars) {
  $vars['options'] = $vars['view']->style_plugin->options;
  foreach ($vars['rows'] as $id => $row) {
    $vars['rows'][$id] = [];
    $track_metadata = [];
    foreach (['title', 'artists', 'trackUrl'] as $track_property) {
      $field = $vars['view']->style_plugin->getField($id, $vars['options'][$track_property]);
      // Track Url needs the file URL the string version the field provides
      // instead of the fid the getFieldValue provides.
      if ($track_property == 'trackUrl') {
        $vars['rows'][$id][$track_property] = (string) $field;
        $track_metadata[$track_property] = (string) $field;
      }
      // Whereas the other fields need the field to render or
      // the pure string version.
      else {
        $vars['rows'][$id][$track_property] = $field;
        $track_metadata[$track_property] = (string) $vars['view']->style_plugin->getField($id, $vars['options'][$track_property]);
      }
    }
    $vars['#attached']['drupalSettings']['performance_player']['track_list'][$id] = $track_metadata;
  }
  $vars['#attached']['library'][] = 'performance_player/player';
}
