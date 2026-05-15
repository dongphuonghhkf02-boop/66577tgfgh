{
  "project": {
    "name": "Торговий Дім ТАМІС АГРО — ТЕХНОЛОГІЯ ВРОЖАЮ (scroll card stack)",
    "goal": "Refine scroll-driven card-stack so ONLY cards animate; left column stays static in natural flow; cards become smaller + fully opaque layers with crisp stacking (no text bleed).",
    "notes": {
      "tech_constraints": [
        "Parent uses transform: scale() (Figma-export). position: sticky unreliable inside transformed parent.",
        "Pin behavior currently implemented via JS translateY on leftColumn and cardsColumn.",
        "CSS Modules + TSX currently in repo, but implementation guidance should be compatible with .js files if needed."
      ],
      "brand_colors_existing": {
        "section_bg": "#1B4332",
        "accent": "#ACB14F",
        "text_cream": "#F9F7F2",
        "card_default": "#F9F7F2"
      }
    }
  },

  "inspiration": {
    "references": [
      {
        "type": "article",
        "title": "Scroll-driven animated card stack with scroll snap",
        "url": "https://www.bram.us/2024/10/13/scroll-driven-animated-card-stack-with-scroll-snap-events/",
        "takeaway": "Clear separation of layers + snap-like progression; cards feel physical when offsets + subtle rotation/shadow are used."
      },
      {
        "type": "dribbble_search",
        "title": "Card stack animation",
        "url": "https://dribbble.com/search/card-stack-animation",
        "takeaway": "Common pattern: opaque cards, thin highlight border, strong z-index discipline, small peek in collapsed state."
      }
    ]
  },

  "design_tokens": {
    "css_custom_properties": {
      ":root": {
        "--tamis-section-bg": "#1B4332",
        "--tamis-accent": "#ACB14F",
        "--tamis-cream": "#F9F7F2",
        "--tamis-ink": "#0F1A14",

        "--card-bg": "#F9F7F2",
        "--card-border": "rgba(27, 67, 50, 0.22)",
        "--card-border-strong": "rgba(27, 67, 50, 0.32)",
        "--card-highlight": "rgba(255, 255, 255, 0.65)",
        "--card-shadow": "0 18px 40px rgba(0, 0, 0, 0.28)",
        "--card-shadow-tight": "0 10px 24px rgba(0, 0, 0, 0.22)",

        "--radius-card": "14px",
        "--radius-card-inner": "10px",

        "--stack-ease": "cubic-bezier(0.22, 1, 0.36, 1)",
        "--stack-ease-snappy": "cubic-bezier(0.16, 1, 0.3, 1)",

        "--stack-peek": "22px",
        "--stack-spread": "104px",

        "--card-w": "640px",
        "--card-h": "340px"
      }
    },
    "typography": {
      "keep_existing_fonts": [
        "Commissioner (headings / numbers)",
        "Golos Text (body)"
      ],
      "card_type_scale": {
        "step_number": {
          "font_size": "96px",
          "line_height": "1.0",
          "font_weight": 500,
          "color": "#1B4332",
          "opacity": 0.92
        },
        "title": {
          "font_size": "44px",
          "line_height": "1.12",
          "font_weight": 600,
          "color": "#1B4332"
        },
        "description": {
          "font_size": "16px",
          "line_height": "1.45",
          "font_weight": 400,
          "color": "rgba(15, 26, 20, 0.86)",
          "max_lines_target": "~5–6 lines"
        }
      }
    }
  },

  "spec": {
    "1_card_dimensions": {
      "current": {
        "w": 753,
        "h": 399,
        "note": "Too large; causes oversized section + messy overlap."
      },
      "recommended": {
        "w": 640,
        "h": 340,
        "radius": 14,
        "padding": 18,
        "reasoning": [
          "~15% smaller in both axes: feels more premium + reduces visual dominance.",
          "Still supports a large step number + 44px title + 5–6 lines of 16px description.",
          "Fits right column placement without forcing huge section height."
        ],
        "internal_layout": {
          "step_number_box": {
            "top": 14,
            "left": 22,
            "w": 150,
            "h": 120,
            "alignment": "top-left",
            "note": "Move number to left to avoid wasting center space; improves hierarchy and reduces overlap risk."
          },
          "text_block": {
            "top": 86,
            "left": 190,
            "right_padding": 22,
            "gap": 16,
            "max_text_width": 420
          }
        },
        "cards_column_container": {
          "top": 290,
          "right": 60,
          "w": 640,
          "h": "card_h + 3*spread = 340 + 3*104 = 652px",
          "note": "Update cardsColumn width/height to match new card size + spread."
        }
      }
    },

    "2_card_visual_style": {
      "goal": "Each card must be a crisp opaque layer; no bleed-through of text from cards beneath.",
      "background": {
        "use": "solid",
        "value": "#F9F7F2",
        "alpha": 1,
        "rule": "Do NOT use rgba() translucency for card backgrounds in the stack."
      },
      "border": {
        "value": "1px solid rgba(27, 67, 50, 0.22)",
        "top_highlight": "inset 0 1px 0 rgba(255,255,255,0.65)",
        "optional_accent_edge": "Add a 3px left accent strip in #ACB14F at 18% opacity (only if it doesn’t look busy)."
      },
      "shadow": {
        "default": "0 18px 40px rgba(0,0,0,0.28)",
        "collapsed_stack": "0 10px 24px rgba(0,0,0,0.22)",
        "note": "Shadow should separate layers on dark green background; keep it soft (no harsh outline)."
      },
      "surface_detail": {
        "optional": "Very subtle paper grain overlay (2–3% opacity) via background-image noise PNG or CSS noise; keep minimal to avoid banding.",
        "do_not": [
          "No gradients on the card surface (reading area).",
          "No glass/translucent cards (causes bleed)."
        ]
      }
    },

    "3_layered_stack_animation": {
      "behavior": {
        "collapsed": "Cards are tightly stacked; only card 01 fully readable; cards 02–04 show a small bottom-edge peek.",
        "expanded": "Cards deal downward (each next card slides down) creating a stepped stack; each card remains mostly readable with partial overlap."
      },
      "geometry": {
        "STACK_PEEK": {
          "value": 22,
          "meaning": "Collapsed offset between cards (design px).",
          "visual": "Shows ~22px of the next card’s top edge (like a deck)."
        },
        "CARD_OFFSET": {
          "value": 104,
          "meaning": "Expanded offset between cards (design px).",
          "visual": "Enough separation to read titles; still overlaps like playing cards."
        },
        "z_index": {
          "collapsed": "Card 01 on top, then 02, 03, 04 beneath (z: 40,30,20,10).",
          "expanded": "Keep same ordering; it preserves the ‘cards slide out from under the top card’ metaphor."
        }
      },
      "easing": {
        "recommended": "cubic-bezier(0.22, 1, 0.36, 1)",
        "alt_snappier": "cubic-bezier(0.16, 1, 0.3, 1)",
        "note": "Use the same easing for translateY and any rotation/scale so motion feels cohesive."
      },
      "optional_physicality": {
        "rotation": {
          "collapsed": "Add tiny rotation per card: card1 0deg, card2 -0.6deg, card3 0.4deg, card4 -0.3deg.",
          "expanded": "Rotate back toward 0deg as progress approaches 1.",
          "rule": "Keep rotation under 1deg to avoid looking gimmicky."
        },
        "scale": {
          "collapsed": "Slight scale-down for deeper cards: 1.00, 0.992, 0.984, 0.976.",
          "expanded": "All cards approach 1.00.",
          "note": "This improves depth separation even without translucency."
        }
      },
      "stack_clarity_rules": [
        "Cards must be fully opaque.",
        "Each card must have its own box-shadow and border.",
        "Never allow multiple cards to share identical XY at rest; even collapsed state must have STACK_PEEK offsets."
      ]
    },

    "4_animation_timing_scroll_room": {
      "user_intent": "Block is small by default; stretches while scrolling down; collapses when scrolling up.",
      "recommended_section_height_design_px": {
        "TOTAL_HEIGHT": 1500,
        "range_ok": "1400–1650",
        "reasoning": [
          "1800px currently feels long for a single 4-step stack.",
          "1500px gives ~1.2–1.4 viewport worth of scroll-room on typical screens after scale, enough for a premium ‘deal’ motion without dragging."
        ]
      },
      "progress_mapping": {
        "start": "When section top hits ~40% from top of viewport (existing maxScroll logic already approximates this).",
        "end": "When progress reaches 1, cards fully spread; after that, section scrolls normally."
      },
      "motion_duration_if_using_css_transition": {
        "translate": "360–420ms",
        "note": "Even though scroll drives it, transition helps smooth rAF quantization; keep short to avoid laggy feel."
      }
    },

    "5_static_left_column": {
      "decision": "YES — this is the correct approach for the user’s intent.",
      "spec": {
        "leftColumn": "Must NOT receive any JS transform/translate for pinning. Remove/disable leftRef translateY logic.",
        "cta_button": "Must remain in normal document flow; no transform changes.",
        "cards_only": "Only cards (and optionally cardsColumn) may be translated for the stack animation."
      },
      "implementation_note": "Because sticky is unreliable under transform:scale, do not attempt to fake-pin the left column. Let it scroll naturally; keep the right stack as the animated storytelling element."
    },

    "6_optional_polish": {
      "hover_top_card": {
        "target": "Only the topmost visible card (card 01 in collapsed; whichever has highest z-index if you later change ordering).",
        "effects": [
          "Increase shadow slightly: from --card-shadow-tight to --card-shadow",
          "Border becomes a touch stronger: rgba(27,67,50,0.32)",
          "TranslateY: -2px (small lift)"
        ],
        "transition": "transition: box-shadow 180ms ease, border-color 180ms ease, filter 180ms ease; (avoid transition: all)",
        "accessibility": "Also apply same effect on :focus-visible for keyboard users."
      },
      "active_card_focus_ring": {
        "spec": "outline: 2px solid rgba(172,177,79,0.55); outline-offset: 3px;",
        "note": "Use only on focus-visible; do not show persistent outlines."
      },
      "reduced_motion": {
        "spec": "If prefers-reduced-motion: reduce, disable rotation/scale and keep only minimal translate offsets (or no animation)."
      }
    }
  },

  "component_path": {
    "existing": [
      "/app/frontend/src/components/welcome/how-it-works-section1.tsx (logic to adjust)",
      "/app/frontend/src/components/welcome/how-it-works-section1.module.css (cardsColumn sizing + card surface styles)",
      "/app/frontend/src/components/welcome/card-step1.tsx (structure)",
      "/app/frontend/src/components/welcome/card-step1.module.css (card dimensions + typography positioning)"
    ],
    "shadcn_optional": [
      "/app/frontend/src/components/ui/button.jsx (only if later migrating CTA to shadcn; not required for this fix)",
      "/app/frontend/src/components/ui/card.jsx (not required; current is Figma-export CSS Modules)"
    ]
  },

  "image_urls": {
    "decorative": [
      {
        "category": "section watermark",
        "description": "Keep existing /watermark.svg leaf; ensure opacity <= 0.55 and behind cards.",
        "url": "/watermark.svg"
      }
    ]
  },

  "instructions_to_main_agent": [
    "Card size: change card to 640×340 design px; update cardsColumn width/height accordingly.",
    "Make cards fully opaque: replace rgba(172,177,79,0.55) with solid #F9F7F2 (or solid near-cream). Add thin border + inset highlight + soft shadow for separation.",
    "Stack animation: set STACK_PEEK=22 and CARD_OFFSET=104 (design px). Ensure each card has unique translateY at all times (no identical XY).",
    "Left column must not move: remove JS translateY pinning for leftColumn and remove its transition/will-change if no longer needed.",
    "Keep cards-only animation: cardsColumn may still be pinned via JS if desired, but do not translate left column.",
    "Optional: add tiny rotation/scale for deeper cards in collapsed state (<=1deg, <=2.4% scale delta) and lerp to 0/1 as progress increases.",
    "Ensure any interactive elements keep data-testid attributes (section already has data-testid; CTA already has data-testid). If cards become interactive later (hover/click), add stable data-testid like data-testid=\"how-it-works-card-01\" etc."
  ]
}

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
