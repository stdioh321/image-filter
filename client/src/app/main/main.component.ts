import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from './main.service';
import { PictureFiltersService } from './picture-filters/picture-filters.service';
import { HttpClient } from '@angular/common/http';


import * as $ from 'jquery';
import 'fabric';
declare const fabric: any;

declare const FilerobotImageEditor: any;
declare const download: any;

declare const Pixie: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  // public tmp = []
  public pixieEditor: any = null;
  public imgUpload = null;
  public currMenu = 1;
  public currFilter = null;
  public currFilterName = null;
  public photoFiltersList = {
    "trending": [
      { name: 'Soft Lilac', filter_name: 'soft_lilac', canChange: false },
      { name: 'Lilac Dreams', filter_name: 'lilac_dreams', canChange: false },
      { name: 'Sweet Caramel', filter_name: 'sweet_caramel', canChange: false },
      { name: 'Light Bokeh', filter_name: 'light_bokeh', canChange: false },
      { name: 'Antique Oil Painting', filter_name: 'antique_oil_painting', canChange: false },
      { name: 'Old Style Bw', filter_name: 'old_style_bw', canChange: false },
      { name: 'Washed Out Edges', filter_name: 'washed_out_edges', canChange: false },
      { name: 'Dreams Of Love', filter_name: 'dreams_of_love', canChange: false },
      { name: 'Tropical Butterflies', filter_name: 'tropical_butterflies', canChange: false },
      { name: 'Vintage Card', filter_name: 'vintage_card', canChange: false }
    ],
    "stylized": [
      { name: 'Old Style Bw', filter_name: 'old_style_bw', canChange: false },
      { name: 'Soft Lilac', filter_name: 'soft_lilac', canChange: false },
      { name: 'Dramatic Bronze', filter_name: 'dramatic_bronze', canChange: false },
      { name: 'Vintage Card', filter_name: 'vintage_card', canChange: false },
      { name: 'Old Photo', filter_name: 'old_photo', canChange: false },
      { name: 'Retro Film', filter_name: 'retro_film', canChange: false },
      { name: 'Triptych Effect', filter_name: 'triptych_effect', canChange: false },
      { name: 'Sweet Caramel', filter_name: 'sweet_caramel', canChange: false },
    ],

    "lighting": [
      { name: 'Rainbow Rays', filter_name: 'rainbow_rays', canChange: false },
      { name: 'Dawn Light', filter_name: 'dawn_light', canChange: false },
      { name: 'Floodlights', filter_name: 'floodlights', canChange: false },
      { name: 'Mysterious Rays', filter_name: 'mysterious_rays', canChange: false },
      { name: 'Moon Night', filter_name: 'moon_night', canChange: false },
      { name: 'Romantic Landscape', filter_name: 'romantic_landscape', canChange: false },
      { name: 'Evening Light', filter_name: 'evening_light', canChange: false }

    ],

    "color": [
      { name: 'Poster Look', filter_name: 'poster_look', canChange: true },
      { name: 'Dreamy Retro', filter_name: 'dreamy_retro', canChange: true },
      { name: 'Retro Sepia', filter_name: 'retro_sepia', canChange: true },
      { name: 'Caramel Haze', filter_name: 'caramel_haze', canChange: true },
      { name: 'Bronze Sepia', filter_name: 'bronze_sepia', canChange: true },
      { name: 'Dramatic Look', filter_name: 'dramatic_look', canChange: true },
      { name: 'Fantasy Blue', filter_name: 'fantasy_blue', canChange: true },
      { name: 'Hdr', filter_name: 'hdr', canChange: true },
      { name: 'Hot Sunset', filter_name: 'hot_sunset', canChange: true },
      { name: 'Dramatic Retro', filter_name: 'dramatic_retro', canChange: true }
    ],

    "fancy_filters": [
      { name: 'Puzzle', filter_name: 'puzzle', canChange: false },
      { name: 'Edge Detection', filter_name: 'edge_detection', canChange: false },
      { name: 'Cartoon', filter_name: 'cartoon', canChange: false },
      { name: 'Dave Hill', filter_name: 'dave_hill', canChange: false },
      { name: 'Infrared', filter_name: 'infrared', canChange: false },
      { name: 'Neon', filter_name: 'neon', canChange: false },
      { name: 'Crazy Fractal', filter_name: 'crazy_fractal', canChange: false },
      { name: 'Matrix', filter_name: 'matrix', canChange: false },
      { name: 'Fire', filter_name: 'fire', canChange: false },
      { name: 'Kaleidoscope', filter_name: 'kaleidoscope', canChange: false },
      { name: 'Underwater', filter_name: 'underwater', canChange: false },
      { name: 'Plastic', filter_name: 'plastic', canChange: false },
      { name: 'Engraving', filter_name: 'engraving', canChange: false },
      { name: 'Cross Stitch', filter_name: 'cross_stitch', canChange: false },
      { name: 'Circle Mosaic', filter_name: 'circle_mosaic', canChange: false },
      { name: 'Isolines', filter_name: 'isolines', canChange: false },
      { name: 'Mosaic', filter_name: 'mosaic', canChange: false },
      { name: 'Image To Text Effect', filter_name: 'image_to_text_effect', canChange: false },
      { name: 'Pixelation', filter_name: 'pixelation', canChange: false }
    ],

    "background": [
      { name: 'Light Bokeh', filter_name: 'light_bokeh', canChange: false },
      { name: 'Dreams Of Love', filter_name: 'dreams_of_love', canChange: false },
      { name: 'Lilac Dreams', filter_name: 'lilac_dreams', canChange: false },
      { name: 'Christmas Bokeh', filter_name: 'christmas_bokeh', canChange: false },
      { name: 'Frozen Window', filter_name: 'frozen_window', canChange: false },
      { name: 'Sunny Field', filter_name: 'sunny_field', canChange: false },
      { name: 'Old Cityscape', filter_name: 'old_cityscape', canChange: false },
      { name: 'Old Street Frame', filter_name: 'old_street_frame', canChange: false },
      { name: 'Winter Scenery', filter_name: 'winter_scenery', canChange: false },
      { name: 'Flower Dream', filter_name: 'flower_dream', canChange: false },
      { name: 'Tropical Butterflies', filter_name: 'tropical_butterflies', canChange: false },
      { name: 'In The Wave', filter_name: 'in_the_wave', canChange: false },
      { name: 'Dreamlike Scenery', filter_name: 'dreamlike_scenery', canChange: false },
      { name: 'Industrial', filter_name: 'industrial', canChange: false }
    ],

    "borders": [
      { name: 'Washed Out Edges', filter_name: 'washed_out_edges', canChange: false },
      { name: 'Simple Edge', filter_name: 'simple_edge', canChange: false },
      { name: 'Semi Transparent Frame', filter_name: 'semi_transparent_frame', canChange: false },
      { name: 'Rounded Border', filter_name: 'rounded_border', canChange: false },
      { name: 'Stamp Frame', filter_name: 'stamp_frame', canChange: false },
      { name: 'Postage Frame', filter_name: 'postage_frame', canChange: false }
    ],

    "draws_pictures": [
      { name: 'Photography in Drawing ', filter_name: 'photography_in_drawing ', canChange: false },
      { name: 'Torn Color Pencil Sketch', filter_name: 'torn_color_pencil_sketch', canChange: false },
      { name: 'Burning Sketch Effect', filter_name: 'burning_sketch_effect', canChange: false },
      { name: 'Photo to Sketch in iPad', filter_name: 'photo_to_sketch_in_ipad', canChange: false },
      { name: 'Ballpoint Pen Drawing vs Photography', filter_name: 'ballpoint_pen_drawing_vs_photography', canChange: false },
      { name: 'Pastel Drawing vs Photography', filter_name: 'pastel_drawing_vs_photography', canChange: false },
      { name: 'Photography vs Watercolor', filter_name: 'photography_vs_watercolor', canChange: false },
      { name: 'Pencil VS Reality', filter_name: 'pencil_vs_reality', canChange: false }
    ],

    "frames": [
      { name: 'Balloon Frame', filter_name: 'balloon_frame', canChange: false },
      { name: 'Heart in Hands', filter_name: 'heart_in_hands', canChange: false },
      { name: 'Fireworks Frame', filter_name: 'fireworks_frame', canChange: false },
      { name: 'Birthday Owls', filter_name: 'birthday_owls', canChange: false },
      { name: 'Wavy Blue Frame', filter_name: 'wavy_blue_frame', canChange: false },
      { name: 'I Love you Honey', filter_name: 'i_love_you_honey', canChange: false },
      { name: 'Frame of Roses', filter_name: 'frame_of_roses', canChange: false },
      { name: 'Burning Frame', filter_name: 'burning_frame', canChange: false },
      { name: 'Cartoon Artist', filter_name: 'cartoon_artist', canChange: false },
      { name: 'Grunge Photo', filter_name: 'grunge_photo', canChange: false },
      { name: 'Entry Into Waterfall', filter_name: 'entry_into_waterfall', canChange: false }
    ],

    "painting_and_drawing": [
      { name: 'Sketch', filter_name: 'sketch', canChange: false },
      { name: 'Color Pencil Drawing', filter_name: 'color_pencil_drawing', canChange: false },
      { name: 'Warm Colors Watercolor', filter_name: 'warm_colors_watercolor', canChange: false },
      { name: 'Trois Couleurs Drawing', filter_name: 'trois_couleurs_drawing', canChange: false },
      { name: 'Sanguine Drawing', filter_name: 'sanguine_drawing', canChange: false },
      { name: 'Vintage Charcoal Sketch', filter_name: 'vintage_charcoal_sketch', canChange: false },
      { name: 'Graphite Pencil Sketch', filter_name: 'graphite_pencil_sketch', canChange: false },
      { name: 'Pastel Drawing', filter_name: 'pastel_drawing', canChange: false },
      { name: 'Pen Sketch', filter_name: 'pen_sketch', canChange: false },
      { name: 'Color Pencil Sketch', filter_name: 'color_pencil_sketch', canChange: false },
      { name: 'Antique Oil Painting', filter_name: 'antique_oil_painting', canChange: false },
      { name: 'Charcoal Drawing', filter_name: 'charcoal_drawing', canChange: false },
      { name: 'Crayon Drawing', filter_name: 'crayon_drawing', canChange: false },
      { name: 'Pen and Ink', filter_name: 'pen_and_ink', canChange: false },
      { name: 'Water Color', filter_name: 'water_color', canChange: false },
      { name: 'Impressionism', filter_name: 'impressionism', canChange: false },
      { name: 'Fusain Painting', filter_name: 'fusain_painting', canChange: false },
      { name: 'Pointillism', filter_name: 'pointillism', canChange: false },
      { name: 'Charcoal', filter_name: 'charcoal', canChange: false },
      { name: 'Van Gogh Style', filter_name: 'van_gogh_style', canChange: false },
      { name: 'Felt Tip Pen Drawing', filter_name: 'felt_tip_pen_drawing', canChange: false },
      { name: 'Pencil Painting', filter_name: 'pencil_painting', canChange: false },
      { name: 'Plumbago', filter_name: 'plumbago', canChange: false },
      { name: 'Painting', filter_name: 'painting', canChange: false }
    ],
    "new_reality": [
      // { name: 'Old Photo Book', filter_name: 'old_photo_book', canChange: false },
      // { name: 'Spring Romance', filter_name: 'spring_romance', canChange: false },
      // { name: 'Birthday Balloons', filter_name: 'birthday_balloons', canChange: false },
      { name: 'Phone In Hands', filter_name: 'phone_in_hands', canChange: false },
      // { name: 'Wedding March', filter_name: 'wedding_march', canChange: false },
      // { name: 'Pin Forever', filter_name: 'pin_forever', canChange: false },
      { name: 'Tretyakov Gallery', filter_name: 'tretyakov_gallery', canChange: false },
      // { name: 'Birthday Cake', filter_name: 'birthday_cake', canChange: false },
      { name: 'Vintage Memories', filter_name: 'vintage_memories', canChange: false },
      // { name: 'Summer Love', filter_name: 'summer_love', canChange: false },
      // { name: 'Morning Coffee', filter_name: 'morning_coffee', canChange: false },
      // { name: 'Love Letters', filter_name: 'love_letters', canChange: false },
      // { name: 'Birthday Cupcakes Card', filter_name: 'birthday_cupcakes_card', canChange: false },
      { name: 'Manuscript', filter_name: 'manuscript', canChange: false },
      // { name: 'London Bridge', filter_name: 'london_bridge', canChange: false },
      // { name: 'Bubbles In The Sky', filter_name: 'bubbles_in_the_sky', canChange: false },
      // { name: 'Paper Rose', filter_name: 'paper_rose', canChange: false },
      // { name: 'Wanted', filter_name: 'wanted', canChange: false },
      { name: 'Mirror Room', filter_name: 'mirror_room', canChange: false },
      // { name: 'Times Square Billboards', filter_name: 'times_square_billboards', canChange: false },
      // { name: 'Reflections In Champagne Glasses', filter_name: 'reflections_in_champagne_glasses', canChange: false },
      // { name: 'Stylish Golden Frame', filter_name: 'stylish_golden_frame', canChange: false },
      // { name: 'Two Hearts Photo Frame', filter_name: 'two_hearts_photo_frame', canChange: false },
      // { name: 'Smart Puppy', filter_name: 'smart_puppy', canChange: false },
      // { name: 'Message In A Bottle', filter_name: 'message_in_a_bottle', canChange: false },
      // { name: 'Balloon', filter_name: 'balloon', canChange: false },
      // { name: 'Shabby Chic Books', filter_name: 'shabby_chic_books', canChange: false },
      { name: 'Traveller Dog', filter_name: 'traveller_dog', canChange: false },
      // { name: 'By The Fireplace', filter_name: 'by_the_fireplace', canChange: false },
      // { name: 'New Year Book', filter_name: 'new_year_book', canChange: false , face:true},
      // { name: 'Heavenly Love', filter_name: 'heavenly_love', canChange: false },
      // { name: 'In A Bookstore', filter_name: 'in_a_bookstore', canChange: false },
      // { name: 'Christmas Bliss', filter_name: 'christmas_bliss', canChange: false },
      // { name: 'Vintage French Book', filter_name: 'vintage_french_book', canChange: false },
      // { name: 'In The Mall', filter_name: 'in_the_mall', canChange: false },
      // { name: 'Glossy Magazine', filter_name: 'glossy_magazine', canChange: false },
      // { name: 'Chamomile Dreams', filter_name: 'chamomile_dreams', canChange: false },
      // { name: 'Photo Mugs Double Frame', filter_name: 'photo_mugs_double_frame', canChange: false },
      // { name: 'Year Of The Rabbit', filter_name: 'year_of_the_rabbit', canChange: false },
      // { name: 'Heart In Hands With Mittens On', filter_name: 'heart_in_hands_with_mittens_on', canChange: false },
      // { name: 'Medallion', filter_name: 'medallion', canChange: false },
      { name: 'Football Championship', filter_name: 'football_championship', canChange: false },
      // { name: 'Wild Poppies', filter_name: 'wild_poppies', canChange: false },
      // { name: 'In The Candle Light', filter_name: 'in_the_candle_light', canChange: false },
      // { name: 'Sunglasses Reflection', filter_name: 'sunglasses_reflection', canChange: false },
      // { name: 'Mall Exhibition', filter_name: 'mall_exhibition', canChange: false },
      // { name: 'Lilac Still Life', filter_name: 'lilac_still_life', canChange: false },
      // { name: 'Little Polar Bear', filter_name: 'little_polar_bear', canChange: false },
      // { name: 'Tulips For You', filter_name: 'tulips_for_you', canChange: false },
      // { name: 'Medieval Castle', filter_name: 'medieval_castle', canChange: false },
      // { name: 'Flushed Away', filter_name: 'flushed_away', canChange: false },
      { name: 'Fishing', filter_name: 'fishing', canChange: false },
      // { name: 'Angels Heart', filter_name: 'angels_heart', canChange: false },
      // { name: 'Cat Dreams', filter_name: 'cat_dreams', canChange: false },
      // { name: 'Romantic Sailer', filter_name: 'romantic_sailer', canChange: false },
      // { name: 'Tropical Underwater Paradise', filter_name: 'tropical_underwater_paradise', canChange: false },
      // { name: 'White Bentley', filter_name: 'white_bentley', canChange: false },
      // { name: 'Embroidery Of Geisha', filter_name: 'embroidery_of_geisha', canChange: false },
      // { name: 'Golden Fish', filter_name: 'golden_fish', canChange: false },
      // { name: 'Waterfall', filter_name: 'waterfall', canChange: false },
      // { name: 'Thoughtful', filter_name: 'thoughtful', canChange: false },
      // { name: 'Football', filter_name: 'football', canChange: false },
      // { name: 'Hungry Tiger', filter_name: 'hungry_tiger', canChange: false },
      // { name: 'Montmartre Artist', filter_name: 'montmartre_artist', canChange: false },
      // { name: 'Orange Butterfly', filter_name: 'orange_butterfly', canChange: false },
      // { name: 'Christmas Lights', filter_name: 'christmas_lights', canChange: false },
      { name: 'In The Wine Glass', filter_name: 'in_the_wine_glass', canChange: false },
      // { name: 'Have You Seen This Person', filter_name: 'have_you_seen_this_person', canChange: false , face:true},
      // { name: 'Billboard At Night', filter_name: 'billboard_at_night', canChange: false },
      // { name: 'Tokyo Night', filter_name: 'tokyo_night', canChange: false },
      // { name: 'Cat Near The Pool', filter_name: 'cat_near_the_pool', canChange: false },
      // { name: 'Airship Over Paris', filter_name: 'airship_over_paris', canChange: false },
      // { name: 'Our Hearts', filter_name: 'our_hearts', canChange: false },
      // { name: 'Xmas Garland', filter_name: 'xmas_garland', canChange: false },
      // { name: 'Reminder Stickers', filter_name: 'reminder_stickers', canChange: false },
      { name: 'Street Graffiti', filter_name: 'street_graffiti', canChange: false },
      // { name: 'Festive Fireworks', filter_name: 'festive_fireworks', canChange: false },
      // { name: 'Pop Art Gallery', filter_name: 'pop_art_gallery', canChange: false },
      // { name: 'Artificial Ikebana', filter_name: 'artificial_ikebana', canChange: false },
      // { name: 'Bubbles On The Beach', filter_name: 'bubbles_on_the_beach', canChange: false },
      // { name: 'Northern Lights', filter_name: 'northern_lights', canChange: false },
      // { name: 'At Penguins Party', filter_name: 'at_penguins_party', canChange: false },
      // { name: 'Camera Lens Reflection', filter_name: 'camera_lens_reflection', canChange: false },
      { name: 'Cowboy Frame', filter_name: 'cowboy_frame', canChange: false },
      // { name: 'Autumn Inspiration', filter_name: 'autumn_inspiration', canChange: false },
      // { name: 'Playsanta', filter_name: 'playsanta', canChange: false },
      // { name: 'Love In The Mountains', filter_name: 'love_in_the_mountains', canChange: false , face:true},
      // { name: 'Red Ferrari', filter_name: 'red_ferrari', canChange: false },
      // { name: 'Easter Egg Photo Card', filter_name: 'easter_egg_photo_card', canChange: false },
      // { name: 'Investigation', filter_name: 'investigation', canChange: false },
      // { name: 'Squirrel Photobomb', filter_name: 'squirrel_photobomb', canChange: false },
      // { name: 'Oscar Ceremony', filter_name: 'oscar_ceremony', canChange: false },
      // { name: 'Romantic Gifts Double Frame', filter_name: 'romantic_gifts_double_frame', canChange: false },
      // { name: 'Burning Heart', filter_name: 'burning_heart', canChange: false },
      // { name: 'Old Museum', filter_name: 'old_museum', canChange: false },
      // { name: 'Eye', filter_name: 'eye', canChange: false , face:true},
      // { name: 'Maya Pyramid', filter_name: 'maya_pyramid', canChange: false },
      // { name: 'Vintage Easter Card', filter_name: 'vintage_easter_card', canChange: false },
      // { name: 'Peaceful Contemplation', filter_name: 'peaceful_contemplation', canChange: false },
      // { name: 'Koenigsegg Car', filter_name: 'koenigsegg_car', canChange: false },
      // { name: 'St Patricks Green Beer', filter_name: 'st_patricks_green_beer', canChange: false },
      // { name: 'Wedding Lock', filter_name: 'wedding_lock', canChange: false },
      // { name: 'Genie Lamp', filter_name: 'genie_lamp', canChange: false },
      // { name: 'Mustang', filter_name: 'mustang', canChange: false },
      // { name: 'New Life', filter_name: 'new_life', canChange: false , face:true},
      // { name: 'Knight In Love', filter_name: 'knight_in_love', canChange: false },
      // { name: 'Halloween Bats', filter_name: 'halloween_bats', canChange: false },
      // { name: 'Crop Circle', filter_name: 'crop_circle', canChange: false },
      // { name: 'Old Letters', filter_name: 'old_letters', canChange: false },
      // { name: 'Creepy Ruins', filter_name: 'creepy_ruins', canChange: false },
      // { name: 'Crazy Man', filter_name: 'crazy_man', canChange: false },
      // { name: 'Enjoying The View', filter_name: 'enjoying_the_view', canChange: false },
      // { name: 'Royal Mirror', filter_name: 'royal_mirror', canChange: false , face:true},
      // { name: 'Half Underwater Photo', filter_name: 'half_underwater_photo', canChange: false },
      // { name: 'Hologram', filter_name: 'hologram', canChange: false },
      // { name: 'Underwater Mermaid', filter_name: 'underwater_mermaid', canChange: false },
      // { name: 'Forever Friends', filter_name: 'forever_friends', canChange: false , face:true},
      { name: 'Snow Globe Photo Frame', filter_name: 'snow_globe_photo_frame', canChange: false },
      // { name: 'War Airplane', filter_name: 'war_airplane', canChange: false },
      // { name: 'Orange Lamborghini', filter_name: 'orange_lamborghini', canChange: false },
      // { name: 'Charles Bridge', filter_name: 'charles_bridge', canChange: false },
      // { name: 'Spring Postcard', filter_name: 'spring_postcard', canChange: false },
      // { name: 'Happy Thanksgiving', filter_name: 'happy_thanksgiving', canChange: false },
      // { name: 'Thanksgiving Day Parade', filter_name: 'thanksgiving_day_parade', canChange: false },
      // { name: 'Stained Glass', filter_name: 'stained_glass', canChange: false },
      // { name: 'Heart Full Of Music', filter_name: 'heart_full_of_music', canChange: false },
      // { name: 'Detective', filter_name: 'detective', canChange: false , face:true},
      { name: 'Watercolor Painting', filter_name: 'watercolor_painting', canChange: false },
      // { name: 'Frozen In Ice', filter_name: 'frozen_in_ice', canChange: false },
      // { name: 'Through Rose Colored Glasses', filter_name: 'through_rose_colored_glasses', canChange: false },
      // { name: 'Catoptromancy', filter_name: 'catoptromancy', canChange: false },
      // { name: 'Hungry Pumpkins', filter_name: 'hungry_pumpkins', canChange: false },
      // { name: 'All Ready For Christmas', filter_name: 'all_ready_for_christmas', canChange: false },
      // { name: 'Love To Hate', filter_name: 'love_to_hate', canChange: false },
      // { name: 'Christmas Bauble', filter_name: 'christmas_bauble', canChange: false },
      // { name: 'Jack O Lantern', filter_name: 'jack_o_lantern', canChange: false },
      // { name: 'Reading The News', filter_name: 'reading_the_news', canChange: false },
      // { name: 'Letter For Santa', filter_name: 'letter_for_santa', canChange: false },
      // { name: 'Cat Paw', filter_name: 'cat_paw', canChange: false },
      // { name: 'Halloween Night', filter_name: 'halloween_night', canChange: false },
      // { name: 'Photo Lab', filter_name: 'photo_lab', canChange: false },
      // { name: 'African Statuettes', filter_name: 'african_statuettes', canChange: false },
      // { name: 'Christmas Gift', filter_name: 'christmas_gift', canChange: false },
      // { name: 'New Face', filter_name: 'new_face', canChange: false , face:true},
      // { name: 'Magic Mirror', filter_name: 'magic_mirror', canChange: false , face:true},
      // { name: 'Cross Stitched Photo In Frame', filter_name: 'cross_stitched_photo_in_frame', canChange: false },
      // { name: 'Ghost Forest', filter_name: 'ghost_forest', canChange: false },
      { name: 'Distorting Mirrors', filter_name: 'distorting_mirrors', canChange: false },
      // { name: 'Bubble', filter_name: 'bubble', canChange: false },
      { name: 'View Through Glasses Effect', filter_name: 'view_through_glasses_effect', canChange: false },
      // { name: 'Ideal Lover', filter_name: 'ideal_lover', canChange: false , face:true},
      // { name: 'Dark Skinned Adorer', filter_name: 'dark_skinned_adorer', canChange: false},
      // { name: 'Blonde And Brunette', filter_name: 'blonde_and_brunette', canChange: false },
      // { name: 'Admiring The Idol', filter_name: 'admiring_the_idol', canChange: false },
      // { name: 'Apollo Admiring', filter_name: 'apollo_admiring', canChange: false },
      // { name: 'Drying Photos', filter_name: 'drying_photos', canChange: false }
    ],
    "celebrities": [
      { name: "Beyonce Knowles", filter_name: "beyonce_knowles", canChange: false },
      { name: "Michael Jackson", filter_name: "michael_jackson", canChange: false },
      { name: "Leonardo Dicaprio", filter_name: "leonardo_dicaprio", canChange: false },
      { name: "Taylor Lautner", filter_name: "taylor_lautner", canChange: false },
      { name: "Jonas Brothers", filter_name: "jonas_brothers", canChange: false },
      { name: "Paul Wesley And Ian Somerhalder", filter_name: "paul_wesley_and_ian_somerhalder", canChange: false },
      { name: "Usher Terry Raymond", filter_name: "usher_terry_raymond", canChange: false },
      { name: "The Beatles", filter_name: "the_beatles", canChange: false },
      { name: "Cody Simpson", filter_name: "cody_simpson", canChange: false },
      { name: "Lil Wayne", filter_name: "lil_wayne", canChange: false },
      { name: "Rihanna", filter_name: "rihanna", canChange: false }
      // { name: "Jennifer Lopez", filter_name: "jennifer_lopez", canChange: false },
      // { name: "Rolling Stones", filter_name: "rolling_stones", canChange: false },
      // { name: "Bill Kaulitz", filter_name: "bill_kaulitz", canChange: false },
      // { name: "Prison Break", filter_name: "prison_break", canChange: false },
      // { name: "Bon Jovi", filter_name: "bon_jovi", canChange: false },
      // { name: "Aishwarya Rai", filter_name: "aishwarya_rai", canChange: false },
      // { name: "Lost", filter_name: "lost", canChange: false },
      // { name: "Pink", filter_name: "pink", canChange: false },
      // { name: "Tom Cruise", filter_name: "tom_cruise", canChange: false },
      // { name: "Sergei Bezrukov", filter_name: "sergei_bezrukov", canChange: false },
      // { name: "Justin Bieber", filter_name: "justin_bieber", canChange: false },
      // { name: "Lionel Messi", filter_name: "lionel_messi", canChange: false },
      // { name: "Bruce Willis", filter_name: "bruce_willis", canChange: false },
      // { name: "Robert Pattinson", filter_name: "robert_pattinson", canChange: false },
      // { name: "Medvedev And Schwarzenegger", filter_name: "medvedev_and_schwarzenegger", canChange: false },
      // { name: "Nicole Kidman", filter_name: "nicole_kidman", canChange: false },
      // { name: "Shah Rukh Khan", filter_name: "shah_rukh_khan", canChange: false },
      // { name: "Selena Gomez", filter_name: "selena_gomez", canChange: false, extraImage: true },
      // { name: "One Direction", filter_name: "one_direction", canChange: false, face: true },
      // { name: "Lady Gaga", filter_name: "lady_gaga", canChange: false },
      // { name: "Angelina Jolie", filter_name: "angelina_jolie", canChange: false },
      // { name: "Brad Pitt", filter_name: "brad_pitt", canChange: false },
      // { name: "Johnny Depp", filter_name: "johnny_depp", canChange: false },
      // { name: "Keira Knightley", filter_name: "keira_knightley", canChange: false },
      // { name: "Kim Kardashian", filter_name: "kim_kardashian", canChange: false },
      // { name: "Jackie Chan", filter_name: "jackie_chan", canChange: false },
      // { name: "House Md", filter_name: "house_md", canChange: false },
      // { name: "David Duchovny", filter_name: "david_duchovny", canChange: false },
      // { name: "Harry Potter", filter_name: "harry_potter", canChange: false },
      // { name: "Kristen Stewart", filter_name: "kristen_stewart", canChange: false }

    ],
    "animations": [
      { name: "Matrix Effect 2", filter_name: "matrix_effect_2", canChange: false },
      { name: "Fire", filter_name: "fire", canChange: false },
      { name: "Matrix Effect 3", filter_name: "matrix_effect_3", canChange: false },
      { name: "Desaturation", filter_name: "desaturation", canChange: false },
      { name: "Water Flow", filter_name: "water_flow", canChange: false },
      { name: "Matrix Effect 1", filter_name: "matrix_effect_1", canChange: false },
      { name: "Rainbow Colors", filter_name: "rainbow_colors", canChange: false },
      { name: "Fire Fading", filter_name: "fire_fading", canChange: false },
      { name: "Blinking", filter_name: "blinking", canChange: false },
      // { name: "Terminator", filter_name: "terminator", canChange: false,face:true },
      // { name: "X Ray", filter_name: "x_ray", canChange: false,face:true  },
      { name: "Scary Effect", filter_name: "scary_effect", canChange: false },
      { name: "Old Movie", filter_name: "old_movie", canChange: false },
      { name: "Radar", filter_name: "radar", canChange: false },
      { name: "Will o the Wisp", filter_name: "will_o_the_wisp", canChange: false },
      { name: "Yin and Yang", filter_name: "yin_and_yang", canChange: false }
    ]
  };
  public logoImagePos = null;
  constructor(
    public spinner: NgxSpinnerService,
    public mainService: MainService,
    public pfService: PictureFiltersService,
    public http: HttpClient
  ) { }

  ngOnInit() {
    this.startPixieEditor();
  }

  uploadImageImgur(file = null, type = null) {
    // let url = "https://api.imgur.com/3/upload";
    let url = "https://api.imgur.com/3/image";
    let clientId = "Client-ID 93117ee7a96785a";
    let options = { headers: { "Authorization": clientId } };
    let fData = new FormData();
    fData.append("image", file);

    if (type)
      fData.append("type", type);
    return this.http.post(url, fData, options);
  }

  onPictureUpload(e) {
    let file = e.target.files[0];
    e.target.value = null;

    if (file) {
      if (file.type.match(/image/gi)) {
        this.spinner.show();

        this.resizeImageFile(file)
          .then(resolve => {
            let tmpImage = (resolve + "").split(',')[1];
            this.pfService.uploadImageImgur(tmpImage)
              .subscribe(res => {
                let img = res['data']['link'];
                this.pfService.loadImageOnCanvas(img, true)
                  .then(res => {
                    this.spinner.hide();
                    this.currFilter = null;
                    this.currFilterName = null;
                    this.currMenu = 1;
                    this.mainService.originalFile = null;
                    this.mainService.original = null;
                    this.mainService.initial = null;
                    this.mainService.current = null;
                    setTimeout(() => {
                      this.mainService.originalFile = file;
                      this.mainService.original = img;
                      this.mainService.current = img;
                      this.mainService.initial = img;
                      // console.log(file);

                    }, 0);


                  })
                  .catch(err => {
                    this.spinner.hide();
                    setTimeout(() => {
                      alert("Não foi possivel carregar a imagem no canvas");
                    }, 500);
                  });
              }, err => {
                console.log(err);
                this.spinner.hide();
                setTimeout(() => {
                  alert("Não foi possivel carregar a imagem");
                }, 500);
              });
          })
          .catch(err => {
            console.log(err);
            this.spinner.hide();
            setTimeout(() => {
              alert("Não foi possivel carregar a imagem");
            }, 500);
          })
      } else {
        alert("Não é uma imagem.");
        this.imgUpload = null;
        return false;
      }
    } else {
      // alert("Imagem necessária.");
      this.imgUpload = null;
      return false;
    }
  }
  changeMenu(idx = 0) {
    if (idx == this.currMenu) return;
    this.currFilter = null;
    this.currMenu = idx;
    let currMenuWrap = document.querySelector('.current-menu-wrap');
    if (currMenuWrap) currMenuWrap.scrollTo(0, 0);
  }
  downloadCurrentImage(e) {

    this.spinner.show();
    let fileName = this.currFilterName ? this.currFilterName : 'original';
    fileName = fileName + "_" + Date.now();
    try {
      download(this.getCurrentImage(), fileName);
      setTimeout(() => {
        this.spinner.hide();
      }, 300);
    } catch (error) {
      this.spinner.hide();
    }
  }
  downloadFile(file, idx) {
    this.spinner.show();
    // let fileName = this.currFilterName
    // fileName = fileName + "_" + Date.now();
    try {
      download(file.data, idx + "_" + file.name + "_" + Date.now());
      setTimeout(() => {
        this.spinner.hide();
      }, 300);
    } catch (error) {
      this.spinner.hide();
    }
  }



  downloadAllImage(e = null) {
    this.spinner.show();
    try {
      this.mainService.picturesList.forEach((item, index) => {
        download(item.data, index + "_" + item.name + "_" + Date.now());
      });
      setTimeout(() => {
        this.spinner.hide();
      }, 300);
    } catch (error) {
      this.spinner.hide();
    }
  }
  addCurrentImage(e) {
    this.spinner.show();
    let fileName = this.currFilterName ? this.currFilterName : 'original';
    let data = { name: fileName, data: this.getCurrentImage() };
    setTimeout(() => {
      this.mainService.picturesList.push(data);
    }, 0);
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  getCurrentImage() {
    let result = null;
    let hasAnimation = this.pfService.animationB64;
    let currentCanvas: HTMLCanvasElement = this.pfService.canvas.getContext().canvas;
    if (hasAnimation) {
      result = hasAnimation
    } else if (currentCanvas) {
      result = currentCanvas.toDataURL();
    } else {
      result = this.mainService.current;
    }
    return result;
  }

  onFilterPhotoSelected(filterName = null, filterIndex = 0, canChangeIntensity = false) {
    if (this.currFilter == filterIndex)
      return;
    this.spinner.show();
    this.pfService.filterPhotoSelected(filterName, canChangeIntensity)
      .then(res => {
        this.currFilter = filterIndex;
        this.currFilterName = filterName;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
        setTimeout(() => {
          alert("Não foi possível aplicar o filtro.");
        }, 800);
      });
  }
  onFilterPhotoAnimationSelected(filterName = null, filterIndex = 0) {
    if (this.currFilter == filterIndex)
      return;
    this.spinner.show();
    this.pfService.filterPhotoAnimationSelected(filterName)
      .then(res => {
        this.currFilter = filterIndex;
        this.currFilterName = filterName;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
        console.log('ANIMATION ERROR');
      });
  }
  onOriginalSelected() {
    this.spinner.show();
    this.pfService.originalSelected()
      .then(res => {
        this.currFilter = null;
        this.currFilterName = null;
        this.spinner.hide();
      }).catch(err => {
        this.spinner.hide();
      });
  }

  onFilterPhotoRangeChange(e) {
    let val = e.target.value || 0;
    this.pfService.filterChangeIntensity(val);
  }
  onFilterRangeChange(e) {
    let val = e.target.value || 0;
    this.pfService.filterChangeIntensity(val);
  }

  openEditor() {
    let config = {};
    config['translations'] = { 'en': { 'toolbar.download': 'Finalize' } };
    config['watermark'] = { fileUpload: true, opacity: 1, position: 'right-bottom' };
    config['tools'] = ['adjust', 'effects', 'filters', 'rotate', 'crop', 'watermark'];

    let ImageEditor = new FilerobotImageEditor(config, { onBeforeComplete: this.onEditComplete.bind(this) });

    let img = this.mainService.original;
    ImageEditor.open(img);


  }
  openPixieEditor() {
    let tmpImage = document.createElement('img');
    let c = document.createElement('canvas');
    let ctx = c.getContext("2d");
    tmpImage.crossOrigin = 'anonymous';
    tmpImage.src = this.mainService.original;

    tmpImage.onload = () => {
      c.width = tmpImage.width;
      c.height = tmpImage.height;
      ctx.drawImage(tmpImage, 0, 0);
      let b64 = c.toDataURL();
      this.pixieEditor.resetAndOpenEditor('image', b64);
    }
    tmpImage.onerror = () => {
      alert('Não foi possível carregar a imagem');
    }
  }
  onPixieEditorSave(result) {

    if (result) {
      this.spinner.show();
      let tmpNewImage = result;
      tmpNewImage = tmpNewImage.split(",")[1];
      this.pfService.uploadImageImgur(tmpNewImage, 'base64')
        .subscribe(res => {
          // this.spinner.hide();
          // console.log(res);
          let img = res['data']['link'];
          this.pfService.loadImageOnCanvas(img)
            .then(response => {
              this.spinner.hide();
              this.currFilter = null;
              this.currMenu = 1;
              this.mainService.original = null;
              this.mainService.current = null;
              setTimeout(() => {
                this.mainService.original = img;
                this.mainService.current = img;
              }, 0);
            })
            .catch(err => {
              this.spinner.hide();
              alert("Não foi possível carregar a imagem no canvas");
            });
        }, err => {
          this.spinner.hide();
          alert("Não foi possível fazer o upload da imagem");
        });
    } else {
      alert("Não foi possível editar a imagem");
    }
  }
  startPixieEditor() {
    if (!window['Pixie']) return false;
    this.pixieEditor = new window['Pixie']({
      openImageDialog: {
        show: false
      },
      onLoad: () => {
        console.log('Pixie is ready');
      },
      ui: {
        allowEditorClose: true,
        mode: 'overlay',
        theme: 'dark',
        toolbar: {
          hideCloseButton: false
        }
      },
      onSave: (b64) => {
        this.onPixieEditorSave(b64);
        this.pixieEditor.close();
      },
      onClose: () => {
        console.log('onClose');
      }

    });
  }

  onEditComplete(result) {
    // console.log('RESULT', result);
    // return false;
    // window.alert("OK");
    if (result['status'] == 'before-complete') {
      // console.log(result['canvas'].toDataURL());
      this.spinner.show();
      let tmpNewImage = result['canvas'].toDataURL();
      tmpNewImage = tmpNewImage.split(",")[1];
      this.pfService.uploadImageImgur(tmpNewImage, 'base64')
        .subscribe(res => {
          // this.spinner.hide();
          // console.log(res);
          let img = res['data']['link'];
          this.pfService.loadImageOnCanvas(img)
            .then(response => {
              this.spinner.hide();
              this.currFilter = null;
              this.currMenu = 1;
              this.mainService.original = null;
              this.mainService.current = null;
              setTimeout(() => {
                this.mainService.original = img;
                this.mainService.current = img;
              }, 0);
            })
            .catch(err => {
              this.spinner.hide();
              alert("Não foi possível carregar a imagem no canvas");
            });
        }, err => {
          this.spinner.hide();
          alert("Não foi possível fazer o upload da imagem");
        });
    } else {
      alert("Não foi possível editar a imagem");
    }
  }
  onBeforeComplete(props) {
    console.log('onBeforeComplete: ');
    // console.log(props.canvas.toDataURL());

  }

  openLogomarca() {
    if (this.pfService.animationB64) {
      this.spinner.show();
      this.pfService.originalSelected()
        .then(res => {
          this.pfService.animationB64 = null;
          this.spinner.hide();
        }).catch(err => {
          this.spinner.hide();
        });
    }
  }
  changeLogoText(e) {
    this.pfService.text.set('text', e.target.value);
    this.pfService.drawWaterMark();
    // this.pfService.canvas.renderAll();

  }
  changeLogoImage(e) {
    // console.log(e);
    let file = e.target.files[0];
    e.target.value = null;
    if (file) {
      if (file.type.match(/image/gi)) {
        let render = new FileReader();
        render.readAsDataURL(file);

        render.onload = (data) => {
          let imgB64 = data['target']['result'];
          this.pfService.updateLogomarcaImg(imgB64);
          this.logoImagePos = null;
        }
      } else {
        alert("Não é uma imagem.");
        return false;
      }
    } else {
      return false;
    }

  }


  resizeImageURL(url = null, width = 600) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(false);
        return false;
      }
      let c = document.createElement('canvas');
      let ctx = c.getContext('2d');
      let img = new Image();
      img.onload = () => {
        c.width = width;
        c.height = img.height * width / img.width;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL());
      }
      img.onerror = () => {
        reject(false);
      }
      img.crossOrigin = "anonymous";
      img.src = url;
    });
  }
  resizeImageFile(file = null, width = 600) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(false);
        return false;
      }

      let render = new FileReader();
      render.readAsDataURL(file);
      render.onload = () => {
        let url = render['result'];
        this.resizeImageURL(url, width)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(false);
          });
      }
      render.onerror = () => {
        reject(false);
      }

    });
  }
  onLogoTextSizeChange(e) {
    let val = e.target.value;
    // console.log(e);
    this.pfService.text.set('fontSize', val);
    this.pfService.drawWaterMark();
  }
  onLogoTextColorChange(e) {
    let colorHex = e.color.hex;
    this.pfService.text.set('fill', colorHex);
    // this.pfService.text.fontSize = this.pfService.text.fontSize;
    this.pfService.drawWaterMark();

  }
  onLogoTextPositionChange(e) {
    let val = e.target.value;
    this.pfService.text.set('pos', val);
    this.pfService.drawWaterMark();
  }

  onLogoImageSizeChange(e) {
    let val = e.target.value;
    // console.log(val);
    this.pfService.image.scaleToWidth(val);
    this.pfService.drawWaterMark();
  }
  onLogoImagePositionChange(e) {
    let val = e.target.value;
    this.pfService.image.set('pos', val);
    this.pfService.drawWaterMark();
  }

  resetAll() {
    if (confirm('Realmente resetar?')) {
      this.currFilter = null;
      this.currMenu = 1;
      this.imgUpload = null;

      this.mainService.clearAll();
      this.pfService.clearAll();
    }
  }
  onRemoveLogoImage() {
    this.pfService.removeLogomarcaImg();
  }


  removeCurrentImage(idx) {
    // console.log(idx);
    this.mainService.picturesList.splice(idx, 1);
  }
  onFilterThumbErro(e) {
    let src = e.target.src;
    e.target.src = "assets/images/filters/filter_original.jpg"
  }

  onSnapChoosed(e) {

    try {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // console.log(stream);
          var snap = null;
          var video: HTMLVideoElement = document.createElement("video");
          video.width = 600;
          // video.height = 600;
          video.srcObject = stream;
          video.onloadedmetadata = (e) => {
            video.play();

            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            var img = new Image();
            canvas.width = video.width;
            canvas.height = video.height;
            ctx.drawImage(video, 0, 0);
            let tmpImg = canvas.toDataURL();
            // console.log(video);
            let tracks = stream.getTracks();

            tracks.forEach(function (track) {
              track.stop();
            });

            video.srcObject = null;

            this.onSnapUpload(tmpImg);
          };
          // video.play();

        })
        .catch(err => {
          console.log(err);
        })
    } catch (error) {
      console.log(error);
    }

  }

  onSnapUpload(b64 = null) {
    // console.log(b64);
    if (!b64)
      return false;
    this.spinner.show();
    let tmpImage = (b64 + "").split(',')[1];
    this.pfService.uploadImageImgur(tmpImage)
      .subscribe(res => {
        let img = res['data']['link'];
        this.pfService.loadImageOnCanvas(img, true)
          .then(res => {
            this.spinner.hide();
            this.currFilter = null;
            this.currFilterName = null;
            this.currMenu = 1;
            this.mainService.originalFile = null;
            this.mainService.original = null;
            this.mainService.initial = null;
            this.mainService.current = null;
            setTimeout(() => {
              // this.mainService.originalFile = file;
              this.mainService.original = img;
              this.mainService.current = img;
              this.mainService.initial = img;
              // console.log(file);
            }, 0);


          })
          .catch(err => {
            this.spinner.hide();
            setTimeout(() => {
              alert("Não foi possivel carregar a imagem no canvas");
            }, 500);
          });
      }, err => {
        console.log(err);
        this.spinner.hide();
        setTimeout(() => {
          alert("Não foi possivel carregar a imagem");
        }, 500);
      });
  }
}


