#!/usr/bin/env python
##################################################
# Gnuradio Python Flow Graph
# Title: Spritedemodnogui
# Generated: Thu Feb 13 13:49:42 2014
##################################################

from gnuradio import blocks
from gnuradio import eng_notation
from gnuradio import gr
from gnuradio.eng_option import eng_option
from gnuradio.filter import firdes
from gnuradio.filter import pfb
from optparse import OptionParser
import sprite

class SpriteDemodNoGUI(gr.top_block):

    def __init__(self, filename):
        gr.top_block.__init__(self, "Spritedemodnogui")

        ##################################################
        # Variables
        ##################################################
        self.chip_rate = chip_rate = 64e3

        ##################################################
        # Blocks
        ##################################################
        self.sprite_sprite_decoder_f_0 = sprite.sprite_decoder_f()
        self.sprite_peak_decimator_ff_0 = sprite.peak_decimator_ff()
        self.sprite_correlator_cf_1 = sprite.correlator_cf(2)
        self.sprite_correlator_cf_0 = sprite.correlator_cf(3)
        self.pfb_arb_resampler_xxx_0 = pfb.arb_resampler_ccf(
        	  .256,
                  taps=None,
        	  flt_size=32)
        	
        self.blocks_wavfile_source_0 = blocks.wavfile_source(filename, False)
        self.blocks_sub_xx_0 = blocks.sub_ff(1)
        self.blocks_float_to_complex_0 = blocks.float_to_complex(1)

        ##################################################
        # Connections
        ##################################################
        self.connect((self.blocks_sub_xx_0, 0), (self.sprite_peak_decimator_ff_0, 0))
        self.connect((self.sprite_correlator_cf_0, 0), (self.blocks_sub_xx_0, 0))
        self.connect((self.sprite_correlator_cf_1, 0), (self.blocks_sub_xx_0, 1))
        self.connect((self.blocks_wavfile_source_0, 0), (self.blocks_float_to_complex_0, 0))
        self.connect((self.blocks_wavfile_source_0, 1), (self.blocks_float_to_complex_0, 1))
        self.connect((self.blocks_float_to_complex_0, 0), (self.pfb_arb_resampler_xxx_0, 0))
        self.connect((self.pfb_arb_resampler_xxx_0, 0), (self.sprite_correlator_cf_0, 0))
        self.connect((self.pfb_arb_resampler_xxx_0, 0), (self.sprite_correlator_cf_1, 0))
        self.connect((self.sprite_peak_decimator_ff_0, 0), (self.sprite_sprite_decoder_f_0, 0))


# QT sink close method reimplementation

    def get_chip_rate(self):
        return self.chip_rate

    def set_chip_rate(self, chip_rate):
        self.chip_rate = chip_rate

if __name__ == '__main__':
    parser = OptionParser(option_class=eng_option, usage="%prog: [options]")
    (options, args) = parser.parse_args()
    tb = SpriteDemodNoGUI(args[0])
    tb.start()
    tb.wait()

