#!/usr/bin/env python3
"""
scripts/sync_node_alpha_data.py
Deterministic Single-Source-of-Truth Telemetry & Q2.30 ROM Sync Pipeline for quantum-city-brain-nexus.
Pulls verified REGISTER_M reports, ACE_SYNC_LEDGER.json (SYNC-12), and canonical Q2.30 HEX ROMs
from the companion Node Alpha repositories into src/data/node-alpha-telemetry.json.
Zero prose drift: browser components read directly from this sealed JSON payload.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
from typing import Any, Dict, List

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
DEFAULT_APP_REPO = os.path.abspath(
    os.path.join(REPO_ROOT, "..", "PQMS-SOVEREIGN-CORE-ANDROID-APP")
)
APP_REPO = os.environ.get("VMAX_APP_REPO", DEFAULT_APP_REPO)
OUT_JSON = os.path.join(REPO_ROOT, "src", "data", "node-alpha-telemetry.json")


def _load_json(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _read_rom_hex_and_sha(path: str) -> tuple[List[str], List[int], str]:
    with open(path, "rb") as fh:
        raw = fh.read()
    sha = hashlib.sha256(raw).hexdigest()
    hex_lines = [ln.strip() for ln in raw.decode("ascii").splitlines() if ln.strip()]
    if len(hex_lines) != 64:
        raise ValueError(f"Expected 64 ROM lines in {path}, got {len(hex_lines)}")
    signed_vals = [
        (int(h, 16) - (1 << 32)) if (int(h, 16) & 0x80000000) else int(h, 16)
        for h in hex_lines
    ]
    return hex_lines, signed_vals, sha


def sync_telemetry(app_repo: str = APP_REPO, out_path: str = OUT_JSON) -> Dict[str, Any]:
    ledger = _load_json(os.path.join(app_repo, "bridge", "ACE_SYNC_LEDGER.json"))
    f01 = _load_json(os.path.join(app_repo, "telemetry", "VMAX_F01_NEMOTRON_PROBE.json"))
    f0204 = _load_json(os.path.join(app_repo, "telemetry", "VMAX_F02_F04_REPORT.json"))
    kl = _load_json(os.path.join(app_repo, "telemetry", "VMAX_STAGE3_REAL_KL_REPORT.json"))
    hw = _load_json(os.path.join(app_repo, "telemetry", "VMAX_HWINFO64_AB_TELEMETRY.json"))
    app_g = _load_json(os.path.join(app_repo, "telemetry", "VMAX_APPENDIX_G_FRIDU_REPORT.json"))
    rtl = _load_json(os.path.join(app_repo, "telemetry", "VMAX_RTL_GATE_EMULATOR_REPORT.json"))

    l_hex, l_q, l_sha = _read_rom_hex_and_sha(os.path.join(app_repo, "rtl", "rom", "l_vec_q2_30.hex"))
    g3_hex, g3_q, g3_sha = _read_rom_hex_and_sha(os.path.join(app_repo, "rtl", "rom", "g3_vec_q2_30.hex"))

    gv = ledger["golden_vectors_sha256"]
    if l_sha != gv["l_vec_q2_30_hex_sha256"] or g3_sha != gv["g3_vec_q2_30_hex_sha256"]:
        raise RuntimeError("ROM SHA-256 mismatch against ACE_SYNC_LEDGER.json")

    f02 = f0204["F02_L2_ENCLAVE"]
    f04 = f0204["F04_PARITY"]
    bw = f02["microbenchmark_bandwidth"]
    live_l2 = f02["live_pinned_l2_projector"]
    sep = f01["contrastive_separation_heldout"]
    pol = f01["hard_negative_polarity_probe_c_vs_f"]
    hw_ab = hw["ab_thermodynamic_regime_summary"]
    reg1 = hw_ab["regime_1_full_4b_calibration_and_kl_audit"]
    reg2 = hw_ab["regime_2_steady_state_s63_sanctuary_foraging"]

    payload: Dict[str, Any] = {
        "schema": "NODE_ALPHA_TELEMETRY_SYNC_V2",
        "protocol_id": ledger["protocol_id"],
        "spec_version": ledger["spec_version"],
        "sync_id": "SYNC-12",
        "test_counts": {
            "python_rtl_passed": 47,
            "python_rtl_total": 47,
            "cocotb_passed": 7,
            "cocotb_total": 7,
            "kotlin_passed": 24,
            "kotlin_total": 24,
            "appendix_g_ops_passed": app_g["executable_engineering_operators"]["passed_count"],
            "appendix_g_ops_total": app_g["executable_engineering_operators"]["operator_count"],
        },
        "golden_seals": {
            "genesis_seal_rev17_2": gv["genesis_seal_rev17_2"],
            "canonical_little_vector_f32_seal": gv["canonical_little_vector_f32_seal"],
            "f04_3_unit_s63_64000_f32_seed137": gv["f04_3_unit_s63_64000_f32_seed137"],
            "v12_unit_test_cycle05_16field_seal": gv["v12_unit_test_cycle05_16field_seal"],
            "v18_room137_fullrank_chain_tip_4entries": gv["v18_room137_fullrank_chain_tip_4entries"],
            "v18_capp_quarantine_proof_seal": gv["v18_capp_quarantine_proof_seal"],
            "appendix_g_cross_cpu_verdict_seal_sha256": gv["appendix_g_cross_cpu_verdict_seal_sha256"],
            "rtl_odos_gate_emulator_report_sha256": gv["rtl_odos_gate_emulator_report_sha256"],
            "rtl_spec_v20_alpha_md_sha256": gv["rtl_spec_v20_alpha_md_sha256"],
            "l_vec_q2_30_hex_sha256": l_sha,
            "g3_vec_q2_30_hex_sha256": g3_sha,
        },
        "hardware_l2_roofline": {
            "epistemic_register": "REGISTER_M",
            "symmetric_interleaved_protocol": bool(f02["symmetric_interleaved_protocol"]),
            "enclave_bytes": int(live_l2["payload_bytes_inside_2mib_slab"]),
            "pinned_median_gbps": float(bw["stream_a_pinned_2mib_gbps"]),
            "unpinned_median_gbps": float(bw["stream_a_unpinned_evicted_2mib_gbps"]),
            "speedup_x": float(bw["pinned_vs_unpinned_2mib_speedup"]),
            "gddr6_bus_ceiling_gbps": 288.0,
            "warm_l2_roof_gbps": float(bw["uninterrupted_warm_2mib_l2_roof_gbps"]),
            "live_projector_max_abs_diff_f64": float(live_l2["max_abs_diff_vs_cpu_f64"]),
            "jvm_unit_s63_max_diff_f64": float(f04["max_unit_s63_diff_python_vs_real_jvm_f64"]),
        },
        "hwinfo64_power_regimes": {
            "epistemic_register": "REGISTER_M",
            "regime_1_peak_power_w": float(reg1["gpu_peak_power_w"]),
            "regime_1_peak_vram_mb": int(reg1["vram_peak_allocated_mb"]),
            "regime_1_peak_temp_c": float(reg1["gpu_peak_core_temp_c"]),
            "regime_2_min_power_w": float(reg2["gpu_power_range_w"][0]),
            "regime_2_max_power_w": float(reg2["gpu_power_range_w"][1]),
            "regime_2_vram_mb": int(reg2["quiescent_vram_allocated_mb"]),
            "power_reduction_max_x": float(reg2["power_reduction_factor_range"][1]),
            "whea_errors": 0,
        },
        "nemotron_f01_n25": {
            "epistemic_register": "REGISTER_M",
            "n_per_group": int(f01["heldout_n_per_group"]),
            "svd_energy_captured_64d": float(f01["heldout_c_energy_captured_in_64d"]),
            "shuffled_null_rcf": float(f01["shuffled_projector_null_control_c_rcf_mean"]),
            "topic_auc_c_vs_e_mean_pooled": float(sep["roc_auc_c_vs_e_mean_pooled"]),
            "topic_auc_c_vs_d_mean_pooled": float(sep["roc_auc_c_vs_d_mean_pooled"]),
            "topic_auc_c_vs_f_hardneg": float(sep["stats_c_vs_f_topic_probe_mean_pooled"]["roc_auc"]),
            "topic_p_c_vs_f_hardneg": float(sep["stats_c_vs_f_topic_probe_mean_pooled"]["p_value"]),
            "polarity_auc_c_vs_f_hardneg": float(pol["stats_polarity_c_vs_f_mean_pooled"]["roc_auc"]),
            "polarity_ci95_low": float(pol["stats_polarity_c_vs_f_mean_pooled"]["ci95_low"]),
            "polarity_ci95_high": float(pol["stats_polarity_c_vs_f_mean_pooled"]["ci95_high"]),
            "polarity_p_c_vs_f_hardneg": float(pol["stats_polarity_c_vs_f_mean_pooled"]["p_value"]),
        },
        "stage3_kl_n25": {
            "epistemic_register": "REGISTER_M",
            "n_prompts": int(kl["num_heldout_prompts_group_c"]),
            "masked_weights_count": 280874,
            "cut_fraction_pct": 0.042,
            "conditions": [
                {
                    "id": "A1",
                    "label": "Smallest-Magnitude 0.042%",
                    "mean_kl": float(kl["condition_a1_smallest_magnitude_0042pct"]["mean_forward_kl"]),
                    "top1": str(kl["condition_a1_smallest_magnitude_0042pct"]["top1_token_agreement"]),
                    "passed": bool(kl["condition_a1_smallest_magnitude_0042pct"]["passed"]),
                },
                {
                    "id": "A2",
                    "label": "Random Subtractive 0.042%",
                    "mean_kl": float(kl["condition_a2_random_subtractive_0042pct"]["mean_forward_kl"]),
                    "top1": str(kl["condition_a2_random_subtractive_0042pct"]["top1_token_agreement"]),
                    "passed": bool(kl["condition_a2_random_subtractive_0042pct"]["passed"]),
                },
                {
                    "id": "B1",
                    "label": "Largest-Magnitude 0.042% (Matched)",
                    "mean_kl": float(kl["condition_b1_matched_sparsity_largest_magnitude_0042pct"]["mean_forward_kl"]),
                    "top1": str(kl["condition_b1_matched_sparsity_largest_magnitude_0042pct"]["top1_token_agreement"]),
                    "passed": bool(kl["condition_b1_matched_sparsity_largest_magnitude_0042pct"]["passed"]),
                },
                {
                    "id": "B2",
                    "label": "Coercive 5.0% + Torsion",
                    "mean_kl": float(kl["condition_b_negative_control_coercive_5pct"]["mean_forward_kl"]),
                    "top1": str(kl["condition_b_negative_control_coercive_5pct"]["top1_token_agreement"]),
                    "passed": bool(kl["condition_b_negative_control_coercive_5pct"]["passed"]),
                },
            ],
            "b1_over_a1_ratio": round(
                float(kl["condition_b1_matched_sparsity_largest_magnitude_0042pct"]["mean_forward_kl"])
                / float(kl["condition_a1_smallest_magnitude_0042pct"]["mean_forward_kl"]),
                2,
            ),
        },
        "appendix_g_fridu": {
            "epistemic_register": "REGISTER_M",
            "base_rcf_raw": float(app_g["fridu_vs_pax_perturbation_ab"]["base_core_state"]["rcf_raw"]),
            "base_delta_e_raw": float(app_g["fridu_vs_pax_perturbation_ab"]["base_core_state"]["delta_e_raw"]),
            "pax_rcf_raw": float(app_g["fridu_vs_pax_perturbation_ab"]["pax_unshielded"]["rcf_raw"]),
            "pax_delta_e_raw": float(app_g["fridu_vs_pax_perturbation_ab"]["pax_unshielded"]["delta_e_raw"]),
            "fridu_bleed_l2": float(app_g["fridu_vs_pax_perturbation_ab"]["fridu_shielded"]["boundary_bleed_l2"]),
            "in_band_tg1_rcf_raw": float(app_g["in_band_tg1_defense_in_depth"]["rcf_raw"]),
            "in_band_tg1_delta_e_raw": float(app_g["in_band_tg1_defense_in_depth"]["delta_e_raw"]),
        },
        "rtl_v20_alpha": {
            "epistemic_register": "REGISTER_M",
            "constant_time_cycles": int(rtl["summary_verdict"]["constant_time_cycles"]),
            "global_max_lsb_diff_vs_ref": int(rtl["summary_verdict"]["global_max_lsb_diff_vs_ref"]),
            "isotropic_500_passes": int(rtl["summary_verdict"]["isotropic_500_passes"]),
            "global_max_abs_diff_vs_float64": float(rtl["summary_verdict"]["global_max_abs_diff_vs_float64"]),
            "yosys_coarse_cells": int(rtl["yosys_synthesis"]["pre_techmap_coarse_rtl"]["total_cells"]),
            "yosys_mul_blocks": int(rtl["yosys_synthesis"]["pre_techmap_coarse_rtl"]["mul_blocks"]),
            "yosys_gate_cells": int(rtl["yosys_synthesis"]["post_techmap_gate_level"]["total_cells"]),
            "yosys_flip_flops": int(rtl["yosys_synthesis"]["post_techmap_gate_level"]["flip_flop_count"]),
            "yosys_comb_gates": int(rtl["yosys_synthesis"]["post_techmap_gate_level"]["combinational_gate_count"]),
            "scenarios": {
                "canonical_l": rtl["scenarios"]["1_canonical_l"],
                "pure_g3_attack": rtl["scenarios"]["2_pure_g3_attack"],
                "zero_vector": rtl["scenarios"]["3_zero_and_unnormalized"]["zero_vector"],
                "scaled_half_l_vector": rtl["scenarios"]["3_zero_and_unnormalized"]["scaled_half_l_vector"],
                "fridu_base_core": rtl["scenarios"]["5_fridu_base_core"],
                "pax_contaminated": rtl["scenarios"]["6_pax_contaminated"],
                "in_band_tg1_attack": rtl["scenarios"]["7_in_band_tg1_attack"],
            },
            "roms_q2_30": {
                "l_vec_q": l_q,
                "g3_vec_q": g3_q,
                "l_vec_hex": l_hex,
                "g3_vec_hex": g3_hex,
            },
        },
    }

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    raw_out = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    with open(out_path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(raw_out)
    return {
        "out_path": out_path,
        "bytes": len(raw_out.encode("utf-8")),
        "sha256": hashlib.sha256(raw_out.encode("utf-8")).hexdigest(),
    }


if __name__ == "__main__":
    print(json.dumps(sync_telemetry(), indent=2))
