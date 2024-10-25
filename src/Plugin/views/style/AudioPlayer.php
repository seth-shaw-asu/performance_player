<?php

namespace Drupal\performance_player\Plugin\views\style;

use Drupal\core\form\FormStateInterface;
use Drupal\views\Plugin\views\style\StylePluginBase;

/**
 * Style plugin to render an audio player.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "audio_player",
 *   title = @Translation("Multi-track Audio Player"),
 *   help = @Translation("Creates an audio player for multiple tracks given a title, artists, and audio URL for each."),
 *   theme = "views_performance_player",
 *   theme_file = "../performance_player.theme.inc",
 *   display_types = {"normal"}
 * )
 */
class AudioPlayer extends StylePluginBase {

  protected $playerAttributeFields = ['title', 'artists', 'trackUrl'];

  /**
   * {@inheritdoc}
   */
  protected $usesFields = TRUE;
  /**
   * {@inheritdoc}
   */
  protected $usesRowPlugin = TRUE;

  /**
   * {@inheritdoc}
   */
  protected $usesGrouping = FALSE;

  /**
   * {@inheritdoc}
   */
  protected function defineOptions() {
    $options = parent::defineOptions();
    foreach ($this->playerAttributeFields as $player_attribute_field) {
      $options[$player_attribute_field] = ['default' => ''];
    }
    return $options;
  }

  /**
   * Render the given style.
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);
    $handlers = $this->displayHandler
      ->getHandlers('field');
    if (empty($handlers)) {
      $form['error_markup'] = [
        '#type' => 'container',
        '#attributes' => ['class' => ['messages', 'messages--error']],
        'message' => $this->t('You need at least one field before you can configure your table settings'),
      ];
      return;
    }
    $field_names = $this->displayHandler->getFieldLabels();
    foreach ($this->playerAttributeFields as $player_attribute_field) {
      $form[$player_attribute_field] = [
        '#title' => $player_attribute_field,
        '#type' => 'select',
        '#options' => $field_names,
        '#default_value' => $this->options[$player_attribute_field],
      ];

    }
  }

}
