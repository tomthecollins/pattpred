exports.assign_instrument_basic = function(instrNum){
	// Tom Collins 3/6/2018.
	// The purpose of this function is to assign a Jam! instrument id to an
	// incoming instrument number, which conform to the standard program
	// change events listed here:
	// https://en.wikipedia.org/wiki/General_MIDI#Program_change_events
	
	// As we add more instruments to our database, I'm hoping we can change many
	// of the repeated instrument ids in the lookup variable to more accurate
	// assignments.
	
	var lookup = [
		// 1.
		"acoustic_grand_piano", // Yes!
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 6.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 11.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 16.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 21.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_guitar_nylon", // Yes!
		// 26.
		"acoustic_guitar_nylon",
		"clean_electric_guitar_2",
		"clean_electric_guitar_2",
		"clean_electric_guitar_2",
		"distortion_guitar",
		// 31.
		"distortion_guitar",
		"distortion_guitar",
		"acoustic_bass", // Yes!
		"electric_bass_finger",
		"electric_bass_finger",
		// 36.
		"electric_bass_finger",
		"electric_bass_finger",
		"electric_bass_finger",
		"synth_bass",
		"synth_bass_2",
		// 41.
		"cello",
		"cello",
		"cello", // Yes!
		"cello",
		"cello",
		// 46.
		"cello",
		"cello",
		"cello",
		"cello",
		"cello",
		// 51.
		"cello",
		"cello",
		"cello",
		"cello",
		"cello",
		// 56.
		"cello",
		"trumpet", // Yes!
		"trumpet",
		"trumpet",
		"trumpet",
		// 61.
		"trumpet",
		"trumpet",
		"trumpet",
		"trumpet",
		"trumpet",
		// 66.
		"trumpet",
		"trumpet",
		"trumpet",
		"english_horn",
		"english_horn",
		// 71.
		"english_horn",
		"clarient", // Yes!
		"flute",
		"flute",
		"flute",
		// 76.
		"flute",
		"flute",
		"flute",
		"flute",
		"flute",
		// 81.
		"am_synth_6",
		"am_synth_5",
		"am_synth_4",
		"am_synth_3",
		"am_synth_2",
		// 86.
		"am_synth_2",
		"am_synth_2",
		"am_synth",
		"fm_synth_6",
		"fm_synth_5",
		// 91.
		"fm_synth_4",
		"fm_synth_3",
		"fm_synth_2",
		"fm_synth_2",
		"fm_synth_2",
		// 96.
		"fm_synth",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 101.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"sitar",
		// 106.
		"sitar",
		"sitar",
		"sitar",
		"sitar",
		"sitar",
		// 111.
		"sitar",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 116.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 121.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		// 126.
		"acoustic_grand_piano",
		"acoustic_grand_piano",
		"acoustic_grand_piano"
	];
	
	if (instrNum < 0 || instrNum > 127){
		return "acoustic_grand_piano";
	}
	else {
		return lookup[instrNum];
	}
};
