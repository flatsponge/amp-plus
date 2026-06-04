# amp-plus

  Unofficial experimental plugins that add extra functionality to Amp (https://ampcode.com).

  ## Plugins

  ### fullmodelpicker.ts

  Adds additional public models to Amp’s model picker, including models that may not appear in the default modes.

  ### context-usage.ts

  Displays your estimated context-window usage as a percentage. Click the indicator to view detailed token usage.
<img width="1152" height="104" alt="image" src="https://github.com/user-attachments/assets/44f0ab09-3f92-4c92-a3e9-62a924be6ead" />

<img width="559" height="75" alt="image" src="https://github.com/user-attachments/assets/9a15302f-dd4d-45ad-978c-e5d4bcb880c2" />


  ## Installation

  Both plugins use the same installation process.

  ### Global Installation

  copy the extention you want to ~/.config/amp/plugins
 
  After installing, open Amp and run:

  Ctrl+O → plugins: reload

  Verify installed plugins:

  amp plugins list

  ## Disclaimer

  > [!WARNING]
  > Highly experimental and unofficial.
  >
  > These plugins are not developed, maintained, endorsed, or supported by Amp. They use Amp’s experimental plugin API, which may change or
  > stop working without notice.
  >
  > Additional models may be unavailable, unstable, rate-limited, or billed differently depending on your Amp account and provider access.
  >
  > Context usage is an estimate based on token information exposed by Amp. It may not exactly match Amp’s internal context or compaction
  > calculations.
  >
  > Review all plugin code before installing it. Use these plugins at your own risk.

  ## License

  Provided as-is, without warranty.
