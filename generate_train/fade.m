function sigOut = fade(sigIn, Fs, lengthSec, fadeDir)

% Tom Collins 29/9/2015.

% This function applies a linear fade (in or out) of specifiable length to
% an input signal.

% INPUT
%  sigIn is an nsamp x nchan matrix, assumed to be audio data.
%  Fs is the sample rate of that audio data.
%  lengthSec is the length of the desired fade in seconds.
%  fadeDir is an optional string argument specifying whether the signal
%   should be faded in (default, fadeDir = 'in') or out (fadeDir = 'out').

if nargin < 4
  warning(['Fade direction (fadeDir) was not specified. Setting '...
    'fadeDir to the default value of "in"']);
  fadeDir = 'in';
end
[nsamp, nchan] = size(sigIn);
switch fadeDir
  case 'in'
     % Convert times in seconds to sample indices.
     s0 = 1;
     s1 = round(Fs*lengthSec);
     if s1 > nsamp;
       warning(['The length of the fade is greater than the length of the '...
         'input signal. The fade length will be truncated.']);
       s1 = nsamp;
     end
     % Constrcut the fade vector.
     fvec = linspace(0, 1, s1 - s0 + 1)';
     fvec = repmat(fvec, 1, nchan);
  case 'out'
    % Convert times in seconds to sample indices.
    s0 = nsamp - round(Fs*lengthSec) + 1;
    s1 = nsamp;
    if s0 < 1;
      warning(['The length of the fade is greater than the length of the '...
        'input signal. The fade length will be truncated.']);
      s0 = 1;
    end
    % Constrcut the fade vector.
    fvec = linspace(1, 0, s1 - s0 + 1)';
    fvec = repmat(fvec, 1, nchan);
  otherwise
    error(['Did not recognise the value of fadeDir (should be "in" '...
      'or "out". Returning.']);
end

% Point-wise multiply fvec against the relevant portion of the signal.
sigOut = sigIn;
sigOut(s0:s1, :) = fvec.*sigIn(s0:s1, :);

end
