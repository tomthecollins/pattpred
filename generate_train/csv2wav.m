function csv2wav(sourceCsv, destWav, sourceDescr, sourceWav,...
  instrNam, Fs, fadeOut)

% Copyright 23/7/2018 Tom Collins

% This function loads stimuli from CSV and JSON files, then assembles and
% writes the corresponding audio stimuli to file.

% Load all the WAV files, to avoid overhead of re-loading WAV files
% associated with repeated notes.
wnam = dir(fullfile(sourceWav, '*.wav'));
[currSnd, currFs] = audioread(fullfile(wnam(1).folder, wnam(1).name));
w = struct('mnn', 21, 'snd', currSnd, 'Fs', currFs);
for iw = 1:size(wnam, 1)
  [currSnd, currFs] = audioread(fullfile(wnam(iw).folder, wnam(iw).name));
  w(iw) = struct('mnn', iw + 20, 'snd', currSnd, 'Fs', currFs);
end

% Get the list of CSV files.
cnam = dir(fullfile(sourceCsv, '*.csv'));
nStim = size(cnam, 1);

% Iterate over stimuli.
for ist = 1:nStim
  if mod(ist, 10) == 0
    fprintf('Processing stimulus %d of %d.\n', ist, nStim);
  end
  % Name of current stimulus.
  [~, snam] = fileparts(cnam(ist).name);
  % THIS WILL NEED UPDATING FOR A MORE COMPLEX DESCRIPTOR FILE WITH A JSON
  % PARSE.
  % Load its bpm.
  descr = jsondecode(fileread(fullfile(sourceDescr, [snam '.json'])));
  bpm = descr.bpm;
  % Load its points.
  notes = csvread(fullfile(sourceCsv, [snam '.csv']));
  % Subtract the floor of the first point so that it begins at a reasonable
  % time.
  notes(:, 1) = notes(:, 1) - floor(notes(1, 1));
  % Convert note ontimes and durations to times in seconds.
  notes(:, [1 4]) = notes(:, [1 4])*60/bpm;
  % Make a vector to contain the sound file.
  lastTime = max(notes(:, 1) + notes(:, 4)) + 1;
  snd = zeros(round(lastTime*Fs), 1);
  
  % Load sound file for each note and put it into the vector.
  nNote = size(notes, 1);
  for iNote = 1:nNote
    % If any durations are less than 0.15 sec, set them to 0.15 sec.
    notes(iNote, 4) = max(notes(iNote, 4), 0.15);
    currMNN = notes(iNote, 2);
    currSnd = w(currMNN - 20).snd;
    currFs = w(currMNN - 20).Fs;
    % Turn MIDI note number into a string.
    % if currMNN < 100
    %   currMNN = ['0' num2str(currMNN)];
    % else
    %   currMNN = num2str(currMNN);
    % end
    % currFname = fullfile(sourceWav,...
    %   [currMNN '_' instrNam '-100.wav']);
    % [currSnd, currFs] = audioread(currFname);
    % If the sampling rate is not equal to the Fs parameter, warn.
    if currFs ~= Fs
      fprintf('%s has a sampling rate of %d.\n', currFname, currFs);
    end
    % Fade currSnd to appropriate length.
    % endSamp is the length of the note in seconds, multiplied by the
    % sample rate, or, if the result of this is actually longer than the
    % sound sample (~4 sec for acoustic_grand_piano), then it is set to the
    % length of the sound sample.
    endSamp = min(size(currSnd, 1), round(notes(iNote, 4)*Fs));
    currSnd = fade(currSnd(1:endSamp), Fs,...
      ...% the fade out cannot be longer than the sound, so we pass in the
      ...% minimum of the fadeOut parameter and the length of the note in
      ...% seconds.
      min(fadeOut, endSamp/Fs),...
      'out');
    % Add currSnd to snd.
    sampBgn = round(notes(iNote, 1)*Fs) + 1;
    sampEnd = round(notes(iNote, 1)*Fs) + endSamp;
    snd(sampBgn:sampEnd) = snd(sampBgn:sampEnd) + currSnd;
  end % Iterate over notes.
  % Prevent clipping.
  maxAmp = max(abs(snd));
  snd = 0.9*snd/maxAmp;
  % Write snd to audio file.
  audiowrite(fullfile(destWav, [snam '.wav']), snd, Fs);
end

end
