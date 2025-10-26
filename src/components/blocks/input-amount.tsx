import { SUPPORTED_TOKENS } from "@avail-project/nexus-core";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import TokenSelect from "./token-select";
import { Label } from "../ui/label";

const InputAmount = ({
  selectedToken,
  handleTokenSelect,
}: {
  selectedToken: SUPPORTED_TOKENS;
  handleTokenSelect: (token: SUPPORTED_TOKENS) => void;
}) => {
  return (
    <div className="flex flex-col gap-y-1">
      <Label className="text-sm font-semibold">Amount</Label>
      <InputGroup>
        <InputGroupInput placeholder="Enter amount" />
        <InputGroupAddon align="inline-end">
          <TokenSelect
            selectedToken={selectedToken}
            handleTokenSelect={handleTokenSelect}
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default InputAmount;
