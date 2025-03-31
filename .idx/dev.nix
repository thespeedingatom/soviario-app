{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.pnpm_8
    pkgs.uv
    pkgs.pipx
    pkgs.python313
    pkgs.sudo
    pkgs.supabase-cli
    pkgs.wrangler_1
    ];
  idx.extensions = [
 "saoudrizwan.claude-dev"];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}
