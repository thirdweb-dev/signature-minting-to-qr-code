import { NFTModule } from "@3rdweb/sdk";
import { useEffect, useState } from "react";

export default function useMinterAddresses(module?: NFTModule) {
  const [mintAddresses, setMintAddresses] = useState<string[] | undefined>(
    undefined
  );
  const [lastAddress, setLastAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!module || lastAddress === module.address) {
      return;
    }

    (async () => {
      const members = await module.getRoleMembers("admin");
      setMintAddresses(members);
      setLastAddress(module.address);
    })();
  }, [module, lastAddress]);

  return mintAddresses;
}
