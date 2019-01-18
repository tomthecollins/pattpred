#| Copyright Tom Collins 18/7/2018

This script selects 550 songs at random from the Lakh
dataset and copies them to a folder. What we really want
is a dataset of size 100 -- hopefully 550 should be
enough with some input not turning into output. |#

(setq
 *rs*
 #.(CCL::INITIALIZE-MRG31K3P-STATE 529708578 839419489
    457277941 463084359 120371988 1860658488))
(setq randn 550)
(setq
 *lakh-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Data" "Music"
    "lmd_full")))
(setq
 *out-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "monophonic" "small" "orig_midi")))

; Get total number of files in each Lakh subdir.
(setq *lakh-dir-list* (list-directory *lakh-dir*))
(setq
 *lakh-subdirs*
 (loop for i from 0 to (- (length *lakh-dir-list*) 1)
      when
      (not (pathname-type (nth i *lakh-dir-list*)))
      collect (nth i *lakh-dir-list*)))
(setq
 *lakh-subdirs-nos*
 (mapcar
  #'(lambda (x) (length (list-directory x)))
  *lakh-subdirs*))
(setq
 *incrementing-totals*
 (fibonacci-list *lakh-subdirs-nos*))
(setq
 *rand-idx*
 (loop for i from 0 to (- randn 1) collect
   (random (my-last *incrementing-totals*) *rs*)))

; Grab appropriate directory and file for each selection.
(loop for i from 0 to (- randn 1) do
  (progn
    (setq
     rel-idx
     (index-1st-sublist-item>
      (nth i *rand-idx*)
      (cons 0 *incrementing-totals*)))
    (setq
     sub-idx
     (-
      (nth i *rand-idx*)
      (nth (- rel-idx 1) (cons 0 *incrementing-totals*))))
    (setq
     file-in
     (nth
      sub-idx
      (list-directory
       (nth (- rel-idx 1) *lakh-subdirs*))))
    (setq
     file-out
     (merge-pathnames
      (make-pathname
       :name (pathname-name file-in)
       :type "mid") *out-dir*))
    (copy-file file-in file-out)))
